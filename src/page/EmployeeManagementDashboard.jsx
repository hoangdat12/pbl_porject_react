import React, { useEffect, useState } from 'react';
import {
  FaSearch,
  FaFileExport,
  FaFilePdf,
  FaEdit,
  FaTrash,
} from 'react-icons/fa';
import MainLayout from '../components/MainLayout';
import axiosInstance from '../ultils/axios/axiosInstance';

const EmployeeManagementDashboard = () => {
  const [employees, setEmployees] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleExportPDF = () => {
    // Implement PDF export functionality
    console.log('Exporting PDF...');
  };

  const handleExportList = () => {
    // Implement list export functionality
    console.log('Exporting employee list...');
  };

  useEffect(() => {
    const getEmployees = async () => {
      const response = await axiosInstance.get('device/employee/BC5BPV21X0');
      if (response.status === 200) {
        setEmployees(response?.data?.data);
      }
    };

    getEmployees();
  }, []);

  return (
    <MainLayout>
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold mb-8'>
          Employee Management Dashboard
        </h1>

        <div className='mb-6 flex flex-wrap items-center justify-between'>
          <div className='relative w-full md:w-1/3 mb-4 md:mb-0'>
            <input
              type='text'
              placeholder='Search employees...'
              className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500'
              value={searchTerm}
              onChange={handleSearch}
            />
            <FaSearch className='absolute left-3 top-3 text-gray-400' />
          </div>

          <select className='w-full md:w-1/4 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500'>
            <option value=''>All Departments</option>
            <option value='IT'>IT</option>
            <option value='Management'>Management</option>
            <option value='Analytics'>Analytics</option>
          </select>

          <div className='w-full md:w-auto mt-4 md:mt-0 flex space-x-4'>
            <button
              onClick={handleExportPDF}
              className='flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300'
            >
              <FaFilePdf className='mr-2' />
              Export PDF
            </button>
            <button
              onClick={handleExportList}
              className='flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300'
            >
              <FaFileExport className='mr-2' />
              Export List
            </button>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {employees.map((employee) => (
            <div
              key={employee.id}
              className='bg-white rounded-lg shadow-md overflow-hidden'
            >
              <img
                src={employee?.image}
                alt={employee?.id}
                className='w-full h-48 object-cover'
              />
              <div className='p-4'>
                <h2 className='text-xl font-semibold mb-2'>
                  {employee?.first_name + ' ' + employee?.last_name}
                </h2>
                <p className='text-gray-600 mb-2'>{employee?.position}</p>
                <p className='text-gray-500 mb-4'>{employee?.deparment}</p>
                <div className='flex justify-between'>
                  <button className='flex items-center px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300'>
                    <FaEdit className='mr-1' />
                    Edit
                  </button>
                  <button className='flex items-center px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300'>
                    <FaTrash className='mr-1' />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default EmployeeManagementDashboard;
