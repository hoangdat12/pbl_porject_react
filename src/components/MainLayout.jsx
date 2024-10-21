import React from 'react';
import Navbar from './Navbar';

const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className='mt-[70px]'>{children}</div>
    </>
  );
};

export default MainLayout;
