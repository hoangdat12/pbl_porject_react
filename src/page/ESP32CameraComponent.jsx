import React, { useState, useEffect, useRef } from 'react';
import { FaCamera } from 'react-icons/fa';
import MainLayout from '../components/MainLayout';
import axiosInstance from '../ultils/axios/axiosInstance';
import { getUserLocalStorageItem } from '../ultils';
import ToastNotification from '../components/ToastNotification';

const ESP32CameraComponent = () => {
  const user = getUserLocalStorageItem();
  const [capturedImage, setCapturedImage] = useState(null);
  const [showMessageSucces, setShowMessageSuccess] = useState('');
  const [message, setMessage] = useState('');
  const videoRef = useRef(null);
  const imageUrlRef = useRef(null); // To keep track of the current image URL

  const handleCapture = async () => {
    const response = await axiosInstance.post(
      'device/control/camera/take-picture',
      {
        clientId: user?.id,
      }
    );
    console.log(response);
    if (response.status === 200) {
    }
  };

  const handleDownload = () => {
    if (capturedImage) {
      const link = document.createElement('a');
      link.href = capturedImage;
      link.download = 'captured_image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCheckIn = async () => {};

  useEffect(() => {
    // Connect to the WebSocket server
    const socket = new WebSocket(
      `ws://${import.meta.env.VITE_APP_WEBSOCKET_URL}`
    );

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
      if (typeof event.data === 'string') {
        // Xử lý thông điệp văn bản
        const data = JSON.parse(event.data);
        if (data?.messageType === 'recognitionSuccess') {
          setIsRecognitionSuccess('success');
          setMessage('Recognition Success');
        } else if (data?.messageType === 'recognitionFailure') {
          setIsRecognitionSuccess('error');
          setMessage('Recognition Failure');
        }
      }
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

  return (
    <MainLayout>
      <div className='max-w-4xl mx-auto px-4 pt-6 sm:p-6 bg-gray-100 rounded-lg shadow-lg'>
        <h1 className='text-3xl font-bold mb-6 text-center text-gray-800'>
          ESP32 Web Camera
        </h1>
        <div className='flex flex-coljustify-between items-center gap-6'>
          <div className='w-full'>
            <div className='relative aspect-video bg-black rounded-lg overflow-hidden'>
              <img
                className='w-full h-full object-cover'
                ref={videoRef}
                alt='Streaming'
                src='https://i.pinimg.com/originals/0a/bd/24/0abd24d18060a97095c90d6afa948860.png'
              />
            </div>
            <button
              onClick={handleCapture}
              className={`mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
              aria-label='Take Picture'
            >
              <FaCamera className='mr-2' />
              Take Picture
            </button>
          </div>
        </div>
        <ToastNotification
          type={showMessageSucces}
          message={message}
          setVisible={setShowMessageSuccess}
        />
      </div>
    </MainLayout>
  );
};

export default ESP32CameraComponent;
