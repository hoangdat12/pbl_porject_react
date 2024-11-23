import React, { useEffect, useState } from 'react';
import {
  FaSort,
  FaUserCircle,
  FaClock,
  FaDoorOpen,
  FaDoorClosed,
  FaFilePdf,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { useParams } from 'react-router-dom';
import axiosInstance from '../ultils/axios/axiosInstance';
import { getFullNameUser } from '../ultils';
import { format, parseISO } from 'date-fns';
import Loading from '../components/Loading';

const EmployeeAttendanceDetails = () => {
  const { employeeId, date } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOverlay, setIsLoadingOverlay] = useState(false);

  const [userInformation, setUserInformation] = useState(null);
  const [checkInDetails, setCheckInDetails] = useState([]);

  const handleExportPDF = async () => {
    try {
      const response = await axiosInstance.get(
        `/history/extract/detail?userId=${employeeId}&date=${date}`,
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

  useEffect(() => {
    const getUserInformation = async () => {
      const response = await axiosInstance.get(`/account/detail/${employeeId}`);
      if (response.status === 200) {
        setUserInformation(response?.data?.data);
      }
    };

    const getCheckInDetails = async () => {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `/history/detail?userId=${employeeId}&date=${date}`
      );
      setIsLoading(false);
      if (response.status === 200) {
        setCheckInDetails(response?.data?.data);
      }
    };

    getUserInformation();
    getCheckInDetails();
  }, [employeeId]);

  return (
    <MainLayout>
      <div className='container mx-auto px-4 py-8 space-y-6'>
        <header className='bg-white shadow-md rounded-lg p-6'>
          <div className='flex justify-between items-center'>
            <h1 className='text-3xl font-bold text-gray-800'>
              Employee Attendance Details
            </h1>
            <nav className='space-y-2'>
              <Link
                to={'/employee/attendence'}
                className='flex flex-1 items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300'
              >
                Go back
              </Link>
              <button
                onClick={handleExportPDF}
                className='flex flex-1 items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300'
              >
                <FaFilePdf className='mr-2' />
                Export
              </button>
            </nav>
          </div>
          <p className='font-medium text-lg text-gray-600 mt-2'>
            Date Time: {date.replaceAll('-', '/')}
          </p>
        </header>

        {isLoading ? (
          <div className='mt-10 flex items-center justify-center'>
            <Loading isLoading={isLoading} />
          </div>
        ) : (
          <>
            <div className='bg-white rounded-lg shadow-md overflow-hidden'>
              <img
                src={userInformation?.image}
                className='w-full h-96 object-cover'
              />
              <div className='p-4'>
                <h2 className='text-xl font-semibold mb-2'>
                  {getFullNameUser(userInformation)}
                </h2>
                <p className='text-gray-600 mb-2'>
                  {userInformation?.position}
                </p>
                <p className='text-gray-500 mb-4'>
                  {userInformation?.deparment}
                </p>
              </div>
            </div>

            <div className='overflow-x-auto'>
              <table className='w-full table-auto'>
                <thead>
                  <tr className='bg-gray-200 text-gray-600 uppercase text-sm leading-normal'>
                    <th
                      className='py-3 px-6 text-left cursor-pointer'
                      onClick={() => handleSort('name')}
                    >
                      <div className='flex items-center'>
                        Employee ID
                        <FaSort className='ml-1' />
                      </div>
                    </th>
                    <th className='py-3 px-6 text-left'>Employee Name</th>
                    <th className='py-3 px-6 text-left'>Department</th>
                    <th
                      className='py-3 px-6 text-left cursor-pointer'
                      onClick={() => handleSort('clockIn')}
                    >
                      <div className='flex items-center'>
                        Check-In Time
                        <FaSort className='ml-1' />
                      </div>
                    </th>
                    <th
                      className='py-3 px-6 text-left cursor-pointer'
                      onClick={() => handleSort('clockOut')}
                    >
                      <div className='flex items-center'>
                        Method
                        <FaSort className='ml-1' />
                      </div>
                    </th>
                    <th className='py-3 px-6 text-left'>Status</th>
                  </tr>
                </thead>
                <tbody className='text-gray-600 text-sm font-light'>
                  {checkInDetails?.map((checkInDeatil) => (
                    <tr
                      key={checkInDeatil?.created_at}
                      className={`border-b border-gray-200 hover:bg-gray-100 ${
                        checkInDeatil?.status === 'Check In'
                          ? 'bg-green-100'
                          : 'bg-red-100'
                      }`}
                    >
                      <td className='py-3 px-6 text-left'>
                        {checkInDeatil?.employee_information?.employee_id}
                      </td>
                      <td className='py-3 px-6 text-left whitespace-nowrap'>
                        <div className='flex items-center'>
                          <FaUserCircle className='mr-2' />
                          {checkInDeatil?.employee_information?.name}
                        </div>
                      </td>
                      <td className='py-3 px-6 text-left'>
                        {checkInDeatil?.employee_information?.department}
                      </td>
                      <td className='py-3 px-6 text-left'>
                        <div className='flex items-center'>
                          <FaClock className='mr-2' />
                          {checkInDeatil?.created_at
                            ? format(
                                parseISO(checkInDeatil?.created_at),
                                'HH:mm:ss'
                              )
                            : null}
                        </div>
                      </td>
                      <td className='py-3 px-6 text-left'>
                        {checkInDeatil?.authenticate_with?.toUpperCase()}
                      </td>
                      <td className='py-3 px-6 text-left'>
                        {checkInDeatil.status === 'Check In' ? (
                          <span className='bg-green-200 text-green-600 py-1 px-3 rounded-full text-xs'>
                            <FaDoorOpen className='inline mr-1' />
                            In Office
                          </span>
                        ) : (
                          <span className='bg-red-200 text-red-600 py-1 px-3 rounded-full text-xs'>
                            <FaDoorClosed className='inline mr-1' />
                            Left
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default EmployeeAttendanceDetails;
