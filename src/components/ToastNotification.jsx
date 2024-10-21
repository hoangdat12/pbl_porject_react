import React, { useEffect } from 'react';
import { FaCheck } from 'react-icons/fa6';
import { PiWarningCircleLight } from 'react-icons/pi';
import { IoMdClose } from 'react-icons/io';

const ToastNotificationIcon = {
  success: {
    icon: FaCheck,
    color: 'text-green-500',
    background: 'bg-green-200',
  },
  error: {
    icon: IoMdClose,
    color: 'text-red-500',
    background: 'bg-red-200',
  },
  warning: {
    icon: PiWarningCircleLight,
    color: 'text-yellow-500',
    background: 'bg-yellow-200',
  },
  info: {
    icon: PiWarningCircleLight,
    color: 'text-blue-500',
    background: 'bg-blue-200',
  },
};

const ToastNotification = ({ type, message, setVisible }) => {
  useEffect(() => {
    if (type && ToastNotificationIcon[type]) {
      const timer = setTimeout(() => {
        setVisible('');
      }, 2000); // 2000ms = 2 seconds

      return () => clearTimeout(timer); // Cleanup the timeout if the component unmounts
    }
  }, [type, setVisible]);

  if (!type || !ToastNotificationIcon[type]) return null;

  const {
    icon: IconComponent,
    color,
    background,
  } = ToastNotificationIcon[type];

  return (
    <div
      className={`fixed bottom-20 right-2 flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow`}
      role='alert'
    >
      <div
        className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${color} ${background} rounded-lg`}
      >
        <IconComponent />
      </div>
      <div className='ms-3 text-sm font-normal'>{message}</div>
      <button
        type='button'
        className='ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8'
        aria-label='Close'
        onClick={() => setVisible('')}
      >
        <IoMdClose />
      </button>
    </div>
  );
};

export default ToastNotification;
