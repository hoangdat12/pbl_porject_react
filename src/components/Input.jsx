import React from 'react';

const Input = ({
  label,
  value,
  setValue,
  name,
  placeholder,
  type = 'text',
  required = false,
}) => {
  return (
    <div>
      <label className='block mb-2 text-sm font-medium text-gray-900'>
        {label}
      </label>
      <input
        type={type}
        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
        placeholder={placeholder ?? 'Enter something...'}
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required={required}
        autoComplete='new-password'
      />
    </div>
  );
};

export default Input;
