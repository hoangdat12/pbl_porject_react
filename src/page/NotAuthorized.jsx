import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';

const NotAuthorized = () => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate('/account');
  };
  return (
    <MainLayout>
      <div>
        <div className='w-screen h-screen gap-12 pt-[30%] px-4'>
          <img src='https://img.freepik.com/free-vector/403-error-forbidden-with-police-concept-illustration_114360-1884.jpg?w=826&t=st=1724737730~exp=1724738330~hmac=6c4e064edc530f60770479df3fb513ca1f1a1011f5c1a2e0e2c28cc8db850eda' />
          <div className='flex flex-col items-center gap-4'>
            <h1 className='text-3xl font-medium text-center'>
              You are not authorized
            </h1>
            <p className='text-xl text-center '>
              You tried to access a page you did not have prior authorization
              for.
            </p>
            <button
              onClick={handleNavigate}
              className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotAuthorized;
