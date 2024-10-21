import { useState, useContext } from 'react';
import Input from '../components/Input';
import axiosInstance from '../ultils/axios/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import LoadingOverlay from '../components/LoadingOverlay';

const Login = () => {
  const navigate = useNavigate();
  const [isLoadingOverlay, setIsLoadingOverlay] = useState(false);

  const [formData, setFormData] = useState({
    password: '',
    username: '',
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
    const response = await axiosInstance.post(
      '/account/authenticate',
      formData
    );
    setIsLoadingOverlay(false);
    if (response.status === 200) {
      const responseData = response.data.data;
      localStorage.setItem('user', JSON.stringify(responseData.user));
      localStorage.setItem('token', JSON.stringify(responseData.access));
      localStorage.setItem(
        'refreshToken',
        JSON.stringify(responseData.refresh)
      );
      navigate('/');
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md'>
        <h2 className='text-3xl font-bold mb-6 text-center text-white'>
          <span className='bg-gradient-to-r text-transparent from-blue-500 to-purple-500 bg-clip-text'>
            LogIn
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

          <div className='flex items-center justify-center pt-2'>
            <button
              type='submit'
              className='bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline w-full'
            >
              LogIn
            </button>
          </div>
          <div className='text-center mt-4'>
            <a href='#' className='text-gray-600 hover:underline'>
              Forgot password?
            </a>
          </div>
        </form>
        <div class='mt-3 text-xs flex justify-between items-center text-[#002D74]'>
          <p>Don't have an account?</p>
          <Link
            to={'/register'}
            class='py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300'
          >
            Register
          </Link>
        </div>
      </div>
      <LoadingOverlay isLoading={isLoadingOverlay} />
    </div>
  );
};

export default Login;
