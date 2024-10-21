import asyncio
import websockets
from io import BytesIO
from PIL import Image, UnidentifiedImageError
from awscrt import io, mqtt, auth, http
from awsiot import mqtt_connection_builder
import sys
import threading
import time
import json
import os

received_all_event = threading.Event()

target_ep = 'aibvj7aq7b6hf-ats.iot.ap-southeast-1.amazonaws.com'
thing_name = 'face_recognition_root_thing'
cert_filepath = os.path.join(os.getcwd(), 'secret/ec4bedfc709127b0fe1a8465c37095b618ebd739a302c5ae1aa722d8b0ef0b19-certificate.pem.crt')
private_key_filepath = os.path.join(os.getcwd(), 'secret/ec4bedfc709127b0fe1a8465c37095b618ebd739a302c5ae1aa722d8b0ef0b19-private.pem.key')
ca_filepath = os.path.join(os.getcwd(), 'secret/AmazonRootCA1.pem')

pub_topic = 'iotfrontier/sub'

# Callback when connection is accidentally lost.
def on_connection_interrupted(connection, error, **kwargs):
    print("Connection interrupted. error: {}".format(error))


# Callback when an interrupted connection is re-established.
def on_connection_resumed(connection, return_code, session_present, **kwargs):
    print("Connection resumed. return_code: {} session_present: {}".format(return_code, session_present))

    if return_code == mqtt.ConnectReturnCode.ACCEPTED and not session_present:
        print("Session did not persist. Resubscribing to existing topics...")
        resubscribe_future, _ = connection.resubscribe_existing_topics()
        resubscribe_future.add_done_callback(on_resubscribe_complete)


def on_resubscribe_complete(resubscribe_future):
    resubscribe_results = resubscribe_future.result()
    print("Resubscribe results: {}".format(resubscribe_results))

    for topic, qos in resubscribe_results['topics']:
        if qos is None:
            sys.exit("Server rejected resubscribe to topic: {}".format(topic))
                
# Callback when the subscribed topic receives a message
def on_message_received(topic, payload, dup, qos, retain, **kwargs):
    print("Received message from topic '{}': {}".format(topic, payload))

# Spin up resources
event_loop_group = io.EventLoopGroup(1)
host_resolver = io.DefaultHostResolver(event_loop_group)
client_bootstrap = io.ClientBootstrap(event_loop_group, host_resolver)

proxy_options = None

mqtt_connection = mqtt_connection_builder.mtls_from_path(
    endpoint=target_ep,
    port=8883,
    cert_filepath=cert_filepath,
    pri_key_filepath=private_key_filepath,
    client_bootstrap=client_bootstrap,
    ca_filepath=ca_filepath,
    on_connection_interrupted=on_connection_interrupted,
    on_connection_resumed=on_connection_resumed,
    client_id=thing_name,
    clean_session=True,
    keep_alive_secs=30,
    http_proxy_options=proxy_options)

print("Connecting to {} with client ID '{}'...".format(
    target_ep, thing_name))

# Connect to the gateway
while True:
    try:
        connect_future = mqtt_connection.connect()
        # Future.result() waits until a result is available
        connect_future.result()
    except:
        print("Connection to IoT Core failed...  retrying in 5s.")
        time.sleep(5)
        continue
    else:
        print("Connected!")
        break

connected_clients = set()  # Keep track of connected clients

def is_valid_image(image_bytes):
    try:
        Image.open(BytesIO(image_bytes))
        return True
    except UnidentifiedImageError:
        return False

async def handle_connection(websocket, path):    
    try:
        while True:
            message = await websocket.recv()
            print("Receiving image")

            if len(message) > 5000 and is_valid_image(message):
                if len(connected_clients) == 0:
                    print("No clients connected")
                    mqtt_message = {
                        "type": "StopStreaming",
                        'message': 'Stop Streaming'
                    }

                    message_json = json.dumps(mqtt_message)
                    mqtt_connection.publish(
                        topic=pub_topic,
                        payload=message_json,
                        qos=mqtt.QoS.AT_LEAST_ONCE
                    )
                    continue
                # Broadcast the image data to all connected clients
                for client in connected_clients:
                    if client != websocket:  # Optionally, skip sending to the sender
                        await client.send(message)
            else:
                try:
                    data = json.loads(message)  # Convert string to dictionary
                    if data.get("clientType") == "react":
                        print("Message is from React client")

                        if len(connected_clients) == 0:
                            mqtt_message = {
                                "type": "StartStreaming",
                                'message': 'Stop Streaming'
                            }

                            message_json = json.dumps(mqtt_message)
                            mqtt_connection.publish(
                                topic=pub_topic,
                                payload=message_json,
                                qos=mqtt.QoS.AT_LEAST_ONCE
                            )
                            
                        connected_clients.add(websocket)

                    elif data.get("clientType") == "esp32":
                        print("Message is from ESP32")
                except json.JSONDecodeError:
                    print("Failed to decode JSON")
            
        
    except websockets.exceptions.ConnectionClosed:
        pass
    finally:
        try:
            connected_clients.remove(websocket)
        except ValueError:
            # Handle the case where the websocket is not in the list
            pass


async def main():
    print("server running on http://localhost:3001")
    server = await websockets.serve(handle_connection, '0.0.0.0', 3001)
    await server.wait_closed()

asyncio.run(main())