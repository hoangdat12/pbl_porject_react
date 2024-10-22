import React, { useState, useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';

const ConfirmModal = ({ onClose, onConfirm, employee }) => {
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('');
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleConfirm = () => {
    try {
      onConfirm();
    } catch (error) {
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300'>
      <div
        ref={modalRef}
        className='w-full sm:max-w-md max-w-[80%] transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:w-full z-100'
        role='dialog'
        aria-modal='true'
        aria-labelledby='modal-headline'
      >
        <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
          <div className='sm:flex sm:items-start'>
            <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
              <h3
                className='text-lg font-medium leading-6 text-gray-900'
                id='modal-headline'
              >
                Confirm Employee Deletion
              </h3>
              <div className='mt-2'>
                <p className='text-sm text-gray-500'>
                  Are you sure you want to delete{' '}
                  <span className='font-medium text-red-500'>
                    {employee?.first_name} {employee?.last_name}
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>
              {message && (
                <div
                  className={`mt-2 rounded-md ${
                    isError
                      ? 'bg-red-50 text-red-800'
                      : 'bg-green-50 text-green-800'
                  } p-2`}
                >
                  <p className='text-sm'>{message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
          <button
            type='button'
            className='inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm'
            onClick={handleConfirm}
          >
            Confirm
          </button>
          <button
            type='button'
            className='mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
