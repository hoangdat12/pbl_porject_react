import React, { useState } from 'react';
import { FaUpload, FaCheck } from 'react-icons/fa';
import MainLayout from '../components/MainLayout';
import { Link } from 'react-router-dom';
import axiosInstance from '../ultils/axios/axiosInstance';
import { getUserLocalStorageItem } from '../ultils';
import LoadingOverlay from '../components/LoadingOverlay';
import ToastNotification from '../components/ToastNotification';

const RegisterEmployee = () => {
  const user = getUserLocalStorageItem();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    position: '',
    department: '',
    employeeId: '',
    status: 'active',
    manager: '',
    gender: '',
    employeeType: '',
    additionalInfo: '',
    rfidId: '',
  });
  const [errors, setErrors] = useState({});
  const [profilePicture, setProfilePicture] = useState(null);
  const [showMessage, setShowMessage] = useState(''); // success || error
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    validateField(name, value);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
  };

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'firstName':
        error = value.trim() === '' ? 'First name is required' : '';
        break;
      case 'lastName':
        error = value.trim() === '' ? 'Last name is required' : '';
        break;
      case 'email':
        error = !/^\S+@\S+\.\S+$/.test(value) ? 'Invalid email format' : '';
        break;
      case 'dateOfBirth':
        error = value === '' ? 'Date of birth is required' : '';
        break;
      case 'position':
        error = value.trim() === '' ? 'Position is required' : '';
        break;
      case 'department':
        error = value.trim() === '' ? 'Department is required' : '';
        break;
      case 'employeeId':
        error = value === '' ? 'Employee Id is required' : '';
        break;
      case 'manager':
        error = value === '' ? 'Manager is required' : '';
        break;
      case 'gender':
        error = value === '' ? 'Gender is required' : '';
        break;
      case 'employeeType':
        error = value === '' ? 'Employee type is required' : '';
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();

    // Append form data
    for (const key in formData) {
      if (key === 'email') {
        fd.append('username', formData[key]);
      }
      if (Object.hasOwnProperty.call(formData, key)) {
        fd.append(key, formData[key]);
      }
    }

    // Append file data
    if (profilePicture) {
      fd.append('image', profilePicture);
      fd.append('registorId', user.id);
    } else {
      return;
    }

    setIsLoading(true);
    const response = await axiosInstance.post('/face/registor/employee', fd, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    setIsLoading(false);
    if (response.status === 200) {
      setShowMessage('success');
      setMessage('Create account successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        position: '',
        gender: 'Male',
        password: '',
        confirmPassword: '',
        username: '',
      });
      setFile(null);
    } else {
      setShowMessage('error');
      setMessage(response.response.data.message || 'Something error happend');
    }
  };

  return (
    <MainLayout>
      <div className='min-h-screen bg-gray-100  px-4 py-6 flex flex-col justify-center sm:py-12'>
        <header className='bg-white shadow-md rounded-lg p-6 block sm:hidden'>
          <div className='flex justify-between items-center'>
            <h1 className='text-3xl font-bold text-gray-800 w-[70%]'>
              Register New Employee
            </h1>
            <div className='w-[30%]'>
              <Link
                to={'/'}
                className='bg-blue-500 text-white font-bold py-2 px-4 rounded'
              >
                Go Back
              </Link>
            </div>
          </div>
        </header>
        <div className='relative py-3 md:w-1/2 sm:max-w-xl sm:mx-auto'>
          <div className='absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl'></div>
          <div className='relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-12'>
            <div className='max-w-md mx-auto '>
              <div className='hidden sm:block'>
                <h1 className='text-2xl font-semibold'>
                  Register New Employee
                </h1>
              </div>
              <form
                onSubmit={handleSubmit}
                className='divide-y divide-gray-200'
              >
                <div className='pb-8 sm:pt-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7'>
                  <div className='flex flex-col'>
                    <label className='leading-loose'>First Name</label>
                    <input
                      type='text'
                      name='firstName'
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 ${
                        errors.firstName ? 'border-red-500' : ''
                      }`}
                      placeholder='Full Name'
                    />
                    {errors.firstName && (
                      <p className='text-red-500 text-xs italic'>
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div className='flex flex-col'>
                    <label className='leading-loose'>Last Name</label>
                    <input
                      type='text'
                      name='lastName'
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 ${
                        errors.lastName ? 'border-red-500' : ''
                      }`}
                      placeholder='Full Name'
                    />
                    {errors.lastName && (
                      <p className='text-red-500 text-xs italic'>
                        {errors.lastName}
                      </p>
                    )}
                  </div>

                  <div className='flex flex-col'>
                    <label className='leading-loose'>Email</label>
                    <input
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 ${
                        errors.email ? 'border-red-500' : ''
                      }`}
                      placeholder='Email'
                    />
                    {errors.email && (
                      <p className='text-red-500 text-xs italic'>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className='flex flex-col'>
                    <label className='leading-loose'>RFID</label>
                    <input
                      type='text'
                      name='rfidId'
                      value={formData.rfidId}
                      onChange={handleInputChange}
                      className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 ${
                        errors.rfidId ? 'border-red-500' : ''
                      }`}
                      placeholder='RFID'
                    />
                    {errors.rfidId && (
                      <p className='text-red-500 text-xs italic'>
                        {errors.rfidId}
                      </p>
                    )}
                  </div>

                  <div className='flex flex-col'>
                    <label className='leading-loose'>Date of Birth</label>
                    <input
                      type='date'
                      name='dateOfBirth'
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 ${
                        errors.dateOfBirth ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.dateOfBirth && (
                      <p className='text-red-500 text-xs italic'>
                        {errors.dateOfBirth}
                      </p>
                    )}
                  </div>
                  <div className='flex flex-col'>
                    <label className='leading-loose'>Position</label>
                    <input
                      type='text'
                      name='position'
                      value={formData.position}
                      onChange={handleInputChange}
                      className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 ${
                        errors.position ? 'border-red-500' : ''
                      }`}
                      placeholder='Position'
                    />
                    {errors.position && (
                      <p className='text-red-500 text-xs italic'>
                        {errors.position}
                      </p>
                    )}
                  </div>
                  <div className='flex flex-col'>
                    <label className='leading-loose'>Department</label>
                    <input
                      type='text'
                      name='department'
                      value={formData.department}
                      onChange={handleInputChange}
                      className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 ${
                        errors.department ? 'border-red-500' : ''
                      }`}
                      placeholder='Department'
                    />
                    {errors.department && (
                      <p className='text-red-500 text-xs italic'>
                        {errors.department}
                      </p>
                    )}
                  </div>

                  <div className='flex flex-col'>
                    <label className='leading-loose'>Employee ID</label>
                    <input
                      type='text'
                      name='employeeId'
                      value={formData.employeeId}
                      onChange={handleInputChange}
                      className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 ${
                        errors.employeeId ? 'border-red-500' : ''
                      }`}
                      placeholder='Employee Id'
                    />
                    {errors.employeeId && (
                      <p className='text-red-500 text-xs italic'>
                        {errors.employeeId}
                      </p>
                    )}
                  </div>

                  <div className='flex flex-col'>
                    <label className='leading-loose'>Gender</label>
                    <div className='flex items-center space-x-4'>
                      <label className='inline-flex items-center'>
                        <input
                          type='radio'
                          name='gender'
                          value='male'
                          checked={formData.gender === 'male'}
                          onChange={handleInputChange}
                          className='form-radio h-5 w-5 text-gray-600'
                        />
                        <span className='ml-2 text-gray-700'>Male</span>
                      </label>
                      <label className='inline-flex items-center'>
                        <input
                          type='radio'
                          name='gender'
                          value='female'
                          checked={formData.gender === 'female'}
                          onChange={handleInputChange}
                          className='form-radio h-5 w-5 text-gray-600'
                        />
                        <span className='ml-2 text-gray-700'>Female</span>
                      </label>
                      <label className='inline-flex items-center'>
                        <input
                          type='radio'
                          name='gender'
                          value='other'
                          checked={formData.gender === 'other'}
                          onChange={handleInputChange}
                          className='form-radio h-5 w-5 text-gray-600'
                        />
                        <span className='ml-2 text-gray-700'>Other</span>
                      </label>
                    </div>
                    {errors.gender && (
                      <p className='text-red-500 text-xs italic'>
                        {errors.gender}
                      </p>
                    )}
                  </div>

                  <div className='flex flex-col'>
                    <label className='leading-loose'>
                      Additional Information
                    </label>
                    <textarea
                      name='additionalInfo'
                      value={formData.additionalInfo}
                      onChange={handleInputChange}
                      rows='3'
                      className='px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600'
                      placeholder='Any additional information...'
                    ></textarea>
                  </div>
                  <div className='flex flex-col'>
                    <label className='leading-loose'>Profile Picture</label>
                    <div className='flex items-center space-x-4'>
                      <label className='w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:text-white'>
                        <FaUpload className='w-8 h-8' />
                        <span className='mt-2 text-base leading-normal'>
                          Select a file
                        </span>
                        <input
                          type='file'
                          className='hidden'
                          onChange={handleFileUpload}
                        />
                      </label>
                      {profilePicture && (
                        <div className='flex items-center'>
                          <FaCheck className='text-green-500 mr-2' />
                          <span>{profilePicture.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className='pt-4 flex items-center space-x-4'>
                  <button
                    className='bg-blue-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none'
                    type='submit'
                  >
                    Register Employee
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastNotification
        type={showMessage}
        message={message}
        setVisible={setShowMessage}
      />
      <LoadingOverlay isLoading={isLoading} />
    </MainLayout>
  );
};

export default RegisterEmployee;
