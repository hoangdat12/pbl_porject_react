import React, { useState, useEffect } from 'react';
import { FaFilePdf, FaClock } from 'react-icons/fa';
import { FiCalendar, FiSearch } from 'react-icons/fi';
import EmployeeRollCallSearch from '../components/EmployeeRollCallSearch';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import axiosInstance from '../ultils/axios/axiosInstance';
import { format, parseISO } from 'date-fns';

const EmployeeRollCall = () => {
  const navigate = useNavigate();

  const [date, setDate] = useState(new Date());
  const [histories, setHistories] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const generatePDF = () => {
    // In a real app, this would generate and download a PDF
    console.log('Generating PDF...');
  };

  const handleNavigate = (userId) => {
    navigate(`/employee/attendence/${userId}`);
  };

  const handleDateChange = async (e) => {
    const newDate = new Date(e.target.value);
    setDate(newDate);

    const response = await axiosInstance.get(
      `/history/date?date=${format(newDate, 'yyyy-MM-dd')}`
    );

    console.log(date, response);

    if (response.status === 200) {
      setHistories(response.data.data);
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  useEffect(() => {
    const get_histories = async () => {
      const response = await axiosInstance.get(
        `/history/date?date=${format(date, 'yyyy-MM-dd')}`
      );
      console.log(response);
      if (response.status === 200) {
        setHistories(response.data.data);
      }
    };
    get_histories();
  }, []);

  return (
    <MainLayout>
      <div className='min-h-screen bg-white sm:p-8 mb-[80px]'>
        <div className='max-w-4xl mx-auto bg-white sm:rounded-lg overflow-hidden'>
          <div className='p-6'>
            <div className='space-y-4'>
              <EmployeeRollCallSearch />

              <div className='mb-8 p-6 bg-white rounded-lg shadow-md'>
                <h2 className='text-xl font-semibold mb-4'>Search by Date</h2>
                <div className='flex flex-wrap items-center gap-4'>
                  <div className='relative'>
                    <input
                      type='date'
                      value={format(date, 'yyyy-MM-dd')}
                      onChange={handleDateChange}
                      className='pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      aria-label='Select date'
                    />
                    <FiCalendar className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                  </div>
                  <button
                    // onClick={handleSearch}
                    className='flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors'
                    aria-label='Search'
                  >
                    <FiSearch className='mr-2' />
                    Search
                  </button>
                </div>
              </div>

              <div className='bg-white rounded-lg shadow-md overflow-hidden'>
                <div className='p-4 sm:p-6'>
                  <h2 className='text-xl font-semibold mb-4'>Employee List</h2>
                  <div className='flex flex-wrap items-center gap-4 mb-4'>
                    <div className='flex items-center'>
                      <label htmlFor='filter' className='mr-2'>
                        Filter:
                      </label>
                      <select
                        id='filter'
                        value={filter}
                        onChange={handleFilterChange}
                        className='border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500'
                      >
                        <option value=''>All Departments</option>
                        <option value='Human Resource'>Human Resource</option>
                        <option value='Development Team'>
                          Development Team
                        </option>
                        <option value='Test Team'>Test Team</option>
                      </select>
                    </div>
                    <div className='flex items-center'>
                      <label htmlFor='sort' className='mr-2'>
                        Sort by:
                      </label>
                      <select
                        id='sort'
                        value={sortBy}
                        onChange={handleSortChange}
                        className='border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500'
                      >
                        <option value='name'>Name</option>
                        <option value='status'>Status</option>
                      </select>
                    </div>
                  </div>
                  <div className='overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-200'>
                      <thead className='bg-gray-50'>
                        <tr>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Employee ID
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Name
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Department
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Check-In Time
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className='bg-white divide-y divide-gray-200'>
                        {histories?.map((entry) => (
                          <tr
                            onClick={() => handleNavigate(entry?.id)}
                            key={entry?.id}
                            className=' cursor-pointer'
                          >
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                              {entry?.employee_information?.employee_id}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                              {entry?.employee_information?.name}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                              {entry?.employee_information?.department}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                              <span className='flex items-center'>
                                <FaClock className='ml-4 mr-2 text-gray-400' />
                                {entry?.created_at
                                  ? format(
                                      parseISO(entry?.created_at),
                                      'HH:mm:ss'
                                    )
                                  : null}
                              </span>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                              <span className='flex items-center'>
                                {entry?.check_in ? 'Present' : 'Absent'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='fixed bottom-0 left-0 right-0 border-t p-4 flex justify-end bg-white'>
            <button
              onClick={generatePDF}
              className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none flex items-center'
            >
              <FaFilePdf className='mr-2' /> Extract PDF
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EmployeeRollCall;
