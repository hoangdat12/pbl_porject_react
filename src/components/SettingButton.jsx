import React from 'react';
import { Link } from 'react-router-dom';

const SettingButton = ({ Icon, title, link }) => {
  return (
    <li className='w-full py-3 px-4 bg-gray-100 rounded-md'>
      <Link
        to={link}
        className='flex items-center justify-start space-x-2 text-xl'
      >
        <Icon />
        <span>{title}</span>
      </Link>
    </li>
  );
};

export default SettingButton;
