import { useState, useContext } from 'react';
import Input from '../components/Input';
import axiosInstance from '../ultils/axios/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import LoadingOverlay from '../components/LoadingOverlay';

const Register = () => {
  const navigate = useNavigate();
  const [isLoadingOverlay, setIsLoadingOverlay] = useState(false);

  const [formData, setFormData] = useState({
    password: '',
    username: '',
    rePassword: '',
    deviceId: '',
  });

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingOverlay(true);
    const response = await axiosInstance.post('/account/register', formData);
    console.log(response);
    setIsLoadingOverlay(false);

    if (response.status === 200) {
      const responseData = response.data.data;
      localStorage.setItem('user', JSON.stringify(responseData.user));
      localStorage.setItem('token', JSON.stringify(responseData.access));
      localStorage.setItem(
        'refreshToken',
        JSON.stringify(responseData.refresh)
      );
      navigate('/login');
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md'>
        <h2 className='text-3xl font-bold mb-6 text-center text-white'>
          <span className='bg-gradient-to-r text-transparent from-blue-500 to-purple-500 bg-clip-text'>
            Register
          </span>
        </h2>
        <form onSubmit={handleSubmit} className='space-y-3'>
          <Input
            label='Username'
            name='username'
            value={formData.username}
            setValue={(value) => handleInputChange('username', value)}
            placeholder='Enter your username'
            required
          />

          <Input
            label='Password'
            type='password'
            name='password'
            value={formData.password}
            setValue={(value) => handleInputChange('password', value)}
            placeholder='Enter your password'
            required
          />

          <Input
            label='Confirm password'
            name='rePassword'
            value={formData.rePassword}
            setValue={(value) => handleInputChange('rePassword', value)}
            placeholder='Enter your Confirm password'
            required
          />

          <Input
            label='Device ID'
            name='deviceId'
            value={formData.deviceId}
            setValue={(value) => handleInputChange('deviceId', value)}
            placeholder='Enter your Device ID'
            required
          />

          <div className='flex items-center justify-center pt-2'>
            <button
              type='submit'
              className='bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline w-full'
            >
              Register
            </button>
          </div>
          <div className='text-center mt-4'>
            <a href='#' className='text-gray-600 hover:underline'>
              Forgot password?
            </a>
          </div>
        </form>
        <div className='mt-3 text-xs flex justify-between items-center text-[#002D74]'>
          <p>Do you already have an account?</p>
          <Link
            to={'/register'}
            className='py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300'
          >
            Login
          </Link>
        </div>
      </div>
      <LoadingOverlay isLoading={isLoadingOverlay} />
    </div>
  );
};

export default Register;
