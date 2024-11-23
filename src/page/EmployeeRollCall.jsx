import React, { useState, useEffect } from 'react';
import { FaFilePdf } from 'react-icons/fa';
import { FiCalendar, FiSearch } from 'react-icons/fi';
import EmployeeRollCallSearch from '../components/EmployeeRollCallSearch';
import MainLayout from '../components/MainLayout';
import axiosInstance from '../ultils/axios/axiosInstance';
import { format } from 'date-fns';
import CheckInHistoryTable from '../components/CheckInHistoryTable';

const EmployeeRollCall = () => {
  const [date, setDate] = useState(new Date());
  const [histories, setHistories] = useState([]);
  const [historiesFilter, setHistoriesFilter] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('id');

  const handleExtractFile = async () => {
    try {
      const response = await axiosInstance.get(
        `/history/extract?date=${format(date, 'yyyy-MM-dd')}`,
        {
          responseType: 'blob', // Ensures the response is handled as a file (PDF)
        }
      );

      // Create a URL for the PDF file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      // Suggest a filename for the exported PDF
      link.setAttribute('download', 'employee_report.xlsx');

      // Append the link to the body and trigger the download
      document.body.appendChild(link);
      link.click();

      // Cleanup: Remove the link after the download starts
      document.body.removeChild(link);

      console.log('PDF export successful.');
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  const handleDateChange = async (e) => {
    const newDate = new Date(e.target.value);
    setDate(newDate);

    const response = await axiosInstance.get(
      `/history/date?date=${format(newDate, 'yyyy-MM-dd')}`
    );

    if (response.status === 200) {
      setHistories(response.data.data);
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleFilterChange = (e) => {
    const filterValue = e.target.value;
    setFilter(filterValue);
    console.log(filterValue);
    if (filterValue === 'all') {
      setHistoriesFilter([]);
      console.log(histories);
      return;
    }

    setHistoriesFilter(
      histories.filter(
        (history) => history?.employee_information?.department === filterValue
      )
    );
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
                        <option value='all'>All Departments</option>
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
                        <option value='id'>ID</option>
                        <option value='status'>Status</option>
                      </select>
                    </div>
                  </div>
                  <CheckInHistoryTable
                    histories={filter === 'all' ? histories : historiesFilter}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='fixed bottom-0 left-0 right-0 border-t p-4 flex justify-end bg-white'>
            <button
              onClick={handleExtractFile}
              className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none flex items-center'
            >
              <FaFilePdf className='mr-2' /> Extract File
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EmployeeRollCall;
