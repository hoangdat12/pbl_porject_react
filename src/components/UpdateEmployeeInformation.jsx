import React, { useEffect, useState, useRef } from 'react';
import { CiCamera } from 'react-icons/ci';
import Input from './Input';
import InputSelect from './InputSelect';
import axiosInstance from '../ultils/axios/axiosInstance';
import { useParams } from 'react-router-dom';
import { capitalizeFirstLetter } from '../ultils';
import LoadingOverlay from '../components/LoadingOverlay';

const UpdateEmployeeInformation = ({ userEdited, setShowModal }) => {
  const [userInformation, setUserInformation] = useState(userEdited);
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [formData, setFormData] = useState({
    firstName: userEdited?.first_name,
    lastName: userEdited?.last_name,
    position: userEdited?.position,
    gender: capitalizeFirstLetter(userEdited?.gender),
    department: userEdited?.deparment,
    employeeId: userEdited?.employee_id,
  });
  const [isLoadingOverlay, setIsLoadingOverlay] = useState(false);
  const modalRef = useRef(null);

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleGenderChange = (gender) => {
    setFormData({
      ...formData,
      gender,
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);
      setFile(file);
    }
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setShowModal(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowModal(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleChangeAvatar = async () => {
    const fd = new FormData();
    if (!file) return;
    fd.append('image', file);
    setIsLoadingOverlay(true);
    const response = await axiosInstance.put(
      `/account/update/avatar/${userInformation?.id}`,
      fd,
      {
        headers: {
          'Content-Type': 'multipart/form-data', // Không cần thêm, axios tự động thêm cho bạn
        },
      }
    );
    setIsLoadingOverlay(false);
    if (response.status === 200) {
      setFile(null);
      setPreviewImage('');
    }
  };

  useEffect(() => {
    // Cleanup function to revoke the object URL
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const handleUpdateUserInformation = async (e) => {
    e.preventDefault();
    if (
      userInformation.first_name != formData.firstName ||
      userInformation.last_name != formData.lastName ||
      userInformation.position != formData.position ||
      userInformation.gender != formData.gender
    ) {
      setIsLoadingOverlay(true);
      const response = await axiosInstance.put(
        `/account/update/${userInformation?.id}`,
        formData
      );
      setIsLoadingOverlay(false);
      if (response.status === 200) {
        const userDetail = response.data.data;
        setUserInformation(userDetail);
        setFormData({
          firstName: userDetail.first_name || '',
          lastName: userDetail.last_name || '',
          position: userDetail.position || '',
          gender: userDetail.gender || 'Male',
        });
        setShowModal(false);
      } else {
        setFormData({
          firstName: userInformation.first_name || '',
          lastName: userInformation.last_name || '',
          position: userInformation.position || '',
          gender: userInformation.gender || 'Male',
        });
      }
    }
  };

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'
      onClick={handleClickOutside}
      role='dialog'
      aria-modal='true'
    >
      <div
        ref={modalRef}
        className='transform transition-all duration-300 ease-in-out bg-gray-200 p-8 pb-6 rounded-lg'
      >
        <div>
          <div className='w-[500px]'>
            <div className='flex items-center justify-center gap-5'>
              <div className='relative overflow-hidden'>
                <img
                  className='w-16 h-16 rounded-full object-cover'
                  src={file ? previewImage : userEdited?.image}
                  alt='Rounded avatar'
                />
                <span className='absolute top-0 right-0 p-1 rounded-full text-white bg-green-500'>
                  <CiCamera />
                </span>
                <input
                  type='file'
                  className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
                  accept='image/*'
                  onChange={handleFileChange}
                />
              </div>
              {file && (
                <div onClick={handleChangeAvatar}>
                  <button className='px-3 py-1 border bg-blue-500 text-white rounded-lg'>
                    Save
                  </button>
                </div>
              )}
            </div>

            <form
              onSubmit={handleUpdateUserInformation}
              autoComplete='off'
              className='mt-4 px-4 bg-white py-6 rounded-lg'
            >
              <div className='flex flex-col gap-6'>
                <Input
                  label='Employee ID'
                  name='employeeId'
                  value={formData.employeeId}
                  setValue={(value) => handleInputChange('employeeId', value)}
                  placeholder='Enter your deparment'
                />

                <Input
                  label='First Name'
                  name='firstName'
                  value={formData.firstName}
                  setValue={(value) => handleInputChange('firstName', value)}
                  placeholder='Enter your first name'
                />

                <Input
                  label='Last Name'
                  name='lastName'
                  value={formData.lastName}
                  setValue={(value) => handleInputChange('lastName', value)}
                  placeholder='Enter your last name'
                />

                <Input
                  label='Position'
                  name='position'
                  value={formData.position}
                  setValue={(value) => handleInputChange('position', value)}
                  placeholder='Enter your position'
                />
                <InputSelect
                  handleChangeOption={handleGenderChange}
                  currentValue={formData.gender}
                />

                <Input
                  label='Department'
                  name='deparment'
                  value={formData.department}
                  setValue={(value) => handleInputChange('deparment', value)}
                  placeholder='Enter your deparment'
                />
              </div>
            </form>
          </div>
        </div>

        <div className='mt-4 flex gap-2 justify-end'>
          <button
            onClick={() => setShowModal(false)}
            className='text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800'
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateUserInformation}
            className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
          >
            Save change
          </button>
        </div>
      </div>
      <LoadingOverlay isLoading={isLoadingOverlay} />
    </div>
  );
};

export default UpdateEmployeeInformation;
