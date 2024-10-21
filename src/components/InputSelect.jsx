import React from 'react';

const InputSelect = ({ currentValue, handleChangeOption }) => {
  return (
    <div className='flex items-center space-x-4'>
      <label className='text-gray-700'>Gender</label>
      <div className='flex items-center'>
        <label
          className={`flex items-center space-x-2 p-2 border rounded-lg ${
            currentValue === 'Male' ? 'border-blue-500' : 'border-gray-300'
          }`}
        >
          <input
            type='radio'
            name='gender'
            value='Male'
            checked={currentValue === 'Male'}
            onChange={() => handleChangeOption('Male')}
            className='form-radio'
          />
          <span>Male</span>
        </label>
      </div>
      <div className='flex items-center'>
        <label
          className={`flex items-center space-x-2 p-2 border rounded-lg ${
            currentValue === 'Female' ? 'border-blue-500' : 'border-gray-300'
          }`}
        >
          <input
            type='radio'
            name='gender'
            value='Female'
            checked={currentValue === 'Female'}
            onChange={() => handleChangeOption('Female')}
            className='form-radio'
          />
          <span>Female</span>
        </label>
      </div>
    </div>
  );
};

export default InputSelect;
