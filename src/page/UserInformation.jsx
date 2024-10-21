import React, { useEffect, useState } from 'react';
import { CiCamera } from 'react-icons/ci';
import Input from '../components/Input';
import InputSelect from '../components/InputSelect';
import axiosInstance from '../ultils/axios/axiosInstance';
import { useParams } from 'react-router-dom';
import ToastNotification from '../components/ToastNotification';
import LoadingOverlay from '../components/LoadingOverlay';
import Loading from '../components/Loading';
import MainLayout from '../components/MainLayout';

const UserInformation = () => {
  const { userId } = useParams();
  const [userInformation, setUserInformation] = useState(null);
  const [showMessage, setShowMessage] = useState(''); // success || error
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [isLoadingOverlay, setIsLoadingOverlay] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    position: '',
    gender: 'Male',
    curPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

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

  const handleChangeAvatar = async () => {
    const fd = new FormData();
    if (!file) return;
    fd.append('image', file);
    setIsLoadingOverlay(true);
    const response = await axiosInstance.put(
      `/account/update/avatar/${userId}`,
      fd,
      {
        headers: {
          'Content-Type': 'multipart/form-data', // Không cần thêm, axios tự động thêm cho bạn
        },
      }
    );
    if (response.status === 200) {
      setFile(null);
      setPreviewImage('');
      setShowMessage('success');
      setMessage('Change avatar successfully.');
    } else {
      setShowMessage('error');
      setMessage('Something error happen.');
    }
    setIsLoadingOverlay(false);
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
      userInformation.gender != formData.gender ||
      (userInformation.curPassword != '' &&
        userInformation.newPassword == userInformation.curPassword)
    ) {
      setIsLoadingOverlay(true);
      const response = await axiosInstance.put(
        `/account/update/${userId}`,
        formData
      );
      if (response.status === 200) {
        setShowMessage('success');
        setMessage('Update information success.');
        const userDetail = response.data.data;
        setUserInformation(userDetail);
        setFormData({
          firstName: userDetail.first_name || '',
          lastName: userDetail.last_name || '',
          position: userDetail.position || '',
          gender: userDetail.gender || 'Male',
          curPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        setShowMessage('error');
        setMessage('Have some error, try again.');
        setFormData({
          firstName: userInformation.first_name || '',
          lastName: userInformation.last_name || '',
          position: userInformation.position || '',
          gender: userInformation.gender || 'Male',
          curPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
      setIsLoadingOverlay(false);
    }
  };

  useEffect(() => {
    const fetchUserDetail = async () => {
      setIsLoading(true);
      const response = await axiosInstance.get(`/account/detail/${userId}`);
      if (response.status === 200) {
        const userDetail = response.data.data;
        setUserInformation(userDetail);
        setFormData({
          firstName: userDetail.first_name || '',
          lastName: userDetail.last_name || '',
          position: userDetail.position || '',
          gender: userDetail.gender || 'Male',
          curPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
      setIsLoading(false);
    };
    fetchUserDetail();
  }, [userId]);

  return (
    <MainLayout>
      <div>
        <div className='py-6 px-4 bg-gray-200 min-h-screen'>
          {isLoading ? (
            <div className='w-screen h-screen flex items-center justify-center'>
              <Loading isLoading={isLoading} />
            </div>
          ) : (
            <>
              <div className='mt-8 flex items-center justify-center gap-5'>
                <div className='relative overflow-hidden'>
                  <img
                    className='w-16 h-16 rounded-full object-cover'
                    src={file ? previewImage : userInformation?.image}
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
                className='mt-4 px-4 bg-white py-4 rounded-lg'
              >
                <div className='grid gap-6 mb-6 md:grid-cols-2'>
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
                    label='Current Password'
                    type='password'
                    name='curPassword'
                    value={formData.curPassword}
                    setValue={(value) =>
                      handleInputChange('curPassword', value)
                    }
                    placeholder='Enter your current password'
                  />

                  <Input
                    label='New Password'
                    type='password'
                    name='newPassword'
                    value={formData.newPassword}
                    setValue={(value) =>
                      handleInputChange('newPassword', value)
                    }
                    placeholder='Enter your new password'
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
                  Save change
                </button>
              </form>
              <ToastNotification
                type={showMessage}
                message={message}
                setVisible={setShowMessage}
              />
              <LoadingOverlay isLoading={isLoadingOverlay} />
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default UserInformation;
