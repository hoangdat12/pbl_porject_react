import React, { useState, useEffect, useRef } from 'react';
import { FaDoorOpen, FaDoorClosed, FaLightbulb } from 'react-icons/fa';
import { MdPanTool } from 'react-icons/md';
import { BiZoomIn, BiZoomOut } from 'react-icons/bi';
import MainLayout from '../components/MainLayout';
import axiosInstance from '../ultils/axios/axiosInstance';
import { getUserLocalStorageItem } from '../ultils';

const StreamingVideoPage = () => {
  const user = getUserLocalStorageItem();
  const [notifications, setNotifications] = useState([]);

  const videoRef = useRef(null);
  const imageUrlRef = useRef(null); // To keep track of the current image URL

  const [doorStatus, setDoorStatus] = useState('closed');
  const [lightStatus, setLightStatus] = useState('off');
  const [lightBrightness, setLightBrightness] = useState(0);
  const [error, setError] = useState(null);

  const toggleDoor = async () => {
    try {
      // Simulating API call to toggle door
      const status = doorStatus === 'open' ? 'closed' : 'open';
      if (status === 'closed') {
        // Close the door
        setDoorStatus(status);
      } else {
        // Open the door
        setDoorStatus(status);
      }
      const message = {
        deviceId: 'BC5BPV21X0',
        doorStatus: status,
      };
      const response = await axiosInstance.post(
        '/device/control/door',
        message
      );
      console.log(response);
    } catch (err) {
      setError('Failed to toggle door. Please try again.');
    }
  };

  const toggleLight = () => {
    try {
      // Simulating API call to toggle light
      setLightStatus(lightStatus === 'on' ? 'off' : 'on');
    } catch (err) {
      setError('Failed to toggle light. Please try again.');
    }
  };

  const adjustBrightness = (e) => {
    const brightness = parseInt(e.target.value);
    setLightBrightness(brightness);
    // Simulating API call to adjust brightness
  };

  useEffect(() => {
    // Connect to the WebSocket server
    const socket = new WebSocket('ws://192.168.1.4:3001');

    // Handle successful connection
    socket.onopen = () => {
      console.log('WebSocket connection established');
      socket.send(
        JSON.stringify({
          clientType: 'react',
          message: 'Hello from React!',
          clientId: user?.id,
        })
      );
    };

    // Handle errors
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Handle incoming messages
    socket.onmessage = (event) => {
      // Revoke the previous image URL
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
      }

      // Create a new image URL
      const imageBlob = new Blob([event.data], { type: 'image/jpeg' });
      const newImageUrl = URL.createObjectURL(imageBlob);
      imageUrlRef.current = newImageUrl; // Update the ref with the new URL

      if (videoRef.current) {
        videoRef.current.src = newImageUrl;
      }
    };

    // Handle connection close
    socket.onclose = (event) => {
      if (event.wasClean) {
        console.log('WebSocket connection closed cleanly');
        socket.send({ clientType: 'react', message: 'Close from React!' });
      } else {
        console.error('WebSocket connection closed with error', event.reason);
      }
    };

    // Cleanup on component unmount
    return () => {
      socket.close();
      // Revoke the final image URL if needed
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Simulating notifications
    setNotifications([
      {
        id: 1,
        message: 'Motion detected in Living Room',
        timestamp: new Date(),
      },
      { id: 2, message: 'Sound alert in Front Door', timestamp: new Date() },
    ]);
  }, []);

  return (
    <MainLayout>
      <div className='min-h-screen bg-gray-100 sm:p-8 w-full'>
        <div className='max-w-7xl mx-auto sm:rounded-lg shadow-lg overflow-hidden'>
          <main className='flex flex-col md:flex-row'>
            <section className='md:w-3/4 p-4'>
              <div className='relative aspect-video bg-black rounded-lg'>
                <img
                  className='w-full h-full object-cover'
                  ref={videoRef}
                  alt='Streaming'
                  src='https://i.pinimg.com/originals/0a/bd/24/0abd24d18060a97095c90d6afa948860.png'
                />
              </div>

              <div className='mt-4 flex space-x-4'>
                <button className='flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition'>
                  <MdPanTool className='w-5 h-5' />
                  <span>Check-in</span>
                </button>
                <button className='flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition'>
                  <BiZoomIn className='w-5 h-5' />
                  <span>Zoom In</span>
                </button>
              </div>
            </section>

            <div className='md:w-1/4 p-4 border-l border-gray-200 md:bg-white'>
              <aside className='p-4 md:p-0 bg-white shadow md:bg-transparent md:shadow-none'>
                <div className=''>
                  <h2 className='text-xl font-semibold mb-4'>Notifications</h2>
                  <ul className='space-y-2'>
                    {notifications.map((notification) => (
                      <li
                        key={notification.id}
                        className='bg-gray-200 md:bg-white p-3 rounded shadow'
                      >
                        <p className='text-sm'>{notification.message}</p>
                        <p className='text-xs text-gray-500 mt-1'>
                          {notification.timestamp.toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>
          </main>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-4'>
            {/* Door Control */}
            <div className='bg-white p-6 rounded-lg shadow'>
              <h2 className='text-xl font-semibold mb-4'>Door Control</h2>
              <div className='flex items-center justify-between'>
                <span className='text-gray-700'>Status: {doorStatus}</span>
                <button
                  onClick={toggleDoor}
                  className={`px-4 py-2 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out ${
                    doorStatus === 'open'
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-green-500 hover:bg-green-600'
                  } text-white`}
                  aria-label={`${
                    doorStatus === 'open' ? 'Close' : 'Open'
                  } the door`}
                >
                  {doorStatus === 'open' ? (
                    <FaDoorOpen className='inline mr-2' />
                  ) : (
                    <FaDoorClosed className='inline mr-2' />
                  )}
                  {doorStatus === 'open' ? 'Close' : 'Open'}
                </button>
              </div>
            </div>

            {/* Light Control */}
            <div className='bg-white p-6 rounded-lg shadow'>
              <h2 className='text-xl font-semibold mb-4'>Light Control</h2>
              <div className='flex items-center justify-between mb-4'>
                <span className='text-gray-700'>Status: {lightStatus}</span>
                <button
                  onClick={toggleLight}
                  className={`px-4 py-2 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out ${
                    lightStatus === 'on'
                      ? 'bg-yellow-500 hover:bg-yellow-600'
                      : 'bg-gray-500 hover:bg-gray-600'
                  } text-white`}
                  aria-label={`Turn ${
                    lightStatus === 'on' ? 'off' : 'on'
                  } the light`}
                >
                  <FaLightbulb className='inline mr-2' />
                  {lightStatus === 'on' ? 'Turn Off' : 'Turn On'}
                </button>
              </div>
              <div>
                <label
                  htmlFor='brightness'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Brightness: {lightBrightness}%
                </label>
                <input
                  type='range'
                  id='brightness'
                  name='brightness'
                  min='0'
                  max='100'
                  value={lightBrightness}
                  onChange={adjustBrightness}
                  className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default StreamingVideoPage;
