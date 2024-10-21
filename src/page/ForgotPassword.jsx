import React, { useEffect, useState } from 'react';
import Input from '../components/Input';
import { useLocation } from 'react-router-dom';
import ToastNotification from '../components/ToastNotification';
import MainLayout from '../components/MainLayout';

const ForgotPassword = () => {
  const location = useLocation();

  const [formData, setFormData] = useState({
    deviceId: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <MainLayout>
      <div>
        <div className='py-6 px-4 bg-gray-200 min-h-screen'>
          <form className='mt-10 px-4 bg-white py-4 rounded-lg'>
            <div className='grid gap-6 mb-6 md:grid-cols-2'>
              <Input
                label='Device ID'
                name='deviceId'
                value={formData.deviceId}
                setValue={(value) => handleInputChange('deviceId', value)}
                placeholder='Enter your device id'
              />

              <Input
                label='Phone number'
                name='phoneNumber'
                value={formData.phoneNumber}
                setValue={(value) => handleInputChange('phoneNumber', value)}
                placeholder='Enter your phone number'
              />

              <Input
                label='Password'
                type='password'
                name='password'
                value={formData.password}
                setValue={(value) => handleInputChange('password', value)}
                placeholder='Enter your password'
              />

              <Input
                label='Confirm password'
                type='password'
                name='confirmPassword'
                value={formData.confirmPassword}
                setValue={(value) =>
                  handleInputChange('confirmPassword', value)
                }
                placeholder='Enter your confirm password'
              />
            </div>

            <button
              type='submit'
              className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
            >
              Submit
            </button>
          </form>
          {/* <ToastNotification
          type={'success'}
          message={'Update password successully'}
          setVisible={}
        /> */}
        </div>
      </div>
    </MainLayout>
  );
};

export default ForgotPassword;
