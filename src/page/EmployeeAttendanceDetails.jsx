import React, { useState } from 'react';
import {
  FaSearch,
  FaFilter,
  FaSort,
  FaUserCircle,
  FaClock,
  FaDoorOpen,
  FaDoorClosed,
  FaFilePdf,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import MainLayout from '../components/MainLayout';

const EmployeeAttendanceDetails = () => {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'John Doe',
      department: 'IT',
      shift: 'Day',
      clockIn: '09:00 AM',
      clockOut: '05:30 PM',
      status: 'out',
    },
    {
      id: 2,
      name: 'Jane Smith',
      department: 'HR',
      shift: 'Day',
      clockIn: '08:45 AM',
      clockOut: null,
      status: 'in',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      department: 'Sales',
      shift: 'Night',
      clockIn: '08:00 PM',
      clockOut: null,
      status: 'in',
    },
    {
      id: 4,
      name: 'Emily Brown',
      department: 'Marketing',
      shift: 'Day',
      clockIn: '09:15 AM',
      clockOut: '06:00 PM',
      status: 'out',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterShift, setFilterShift] = useState('');
  const [sortBy, setSortBy] = useState('');

  const handleSort = (criteria) => {
    setSortBy(criteria);
    const sortedEmployees = [...employees].sort((a, b) => {
      if (a[criteria] < b[criteria]) return -1;
      if (a[criteria] > b[criteria]) return 1;
      return 0;
    });
    setEmployees(sortedEmployees);
  };

  const handleExportPDF = () => {
    // Implement PDF export functionality
    console.log('Exporting PDF...');
  };

  const filteredEmployees = employees.filter((employee) => {
    return (
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterDepartment === '' || employee.department === filterDepartment) &&
      (filterShift === '' || employee.shift === filterShift)
    );
  });

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
          <p className='text-gray-600 mt-2'>
            Current Date: {new Date().toLocaleDateString()}
          </p>
        </header>

        <div className='bg-white rounded-lg shadow-md overflow-hidden'>
          <img
            src='https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
            className='w-full h-48 object-cover'
          />
          <div className='p-4'>
            <h2 className='text-xl font-semibold mb-2'>John Doe</h2>
            <p className='text-gray-600 mb-2'>Software Engineer</p>
            <p className='text-gray-500 mb-4'>IT</p>
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
                    Name
                    <FaSort className='ml-1' />
                  </div>
                </th>
                <th className='py-3 px-6 text-left'>Department</th>
                <th className='py-3 px-6 text-left'>Shift</th>
                <th
                  className='py-3 px-6 text-left cursor-pointer'
                  onClick={() => handleSort('clockIn')}
                >
                  <div className='flex items-center'>
                    Clock In
                    <FaSort className='ml-1' />
                  </div>
                </th>
                <th
                  className='py-3 px-6 text-left cursor-pointer'
                  onClick={() => handleSort('clockOut')}
                >
                  <div className='flex items-center'>
                    Clock Out
                    <FaSort className='ml-1' />
                  </div>
                </th>
                <th className='py-3 px-6 text-left'>Status</th>
              </tr>
            </thead>
            <tbody className='text-gray-600 text-sm font-light'>
              {filteredEmployees.map((employee) => (
                <tr
                  key={employee.id}
                  className={`border-b border-gray-200 hover:bg-gray-100 ${
                    employee.status === 'in' ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  <td className='py-3 px-6 text-left whitespace-nowrap'>
                    <div className='flex items-center'>
                      <FaUserCircle className='mr-2' />
                      {employee.name}
                    </div>
                  </td>
                  <td className='py-3 px-6 text-left'>{employee.department}</td>
                  <td className='py-3 px-6 text-left'>{employee.shift}</td>
                  <td className='py-3 px-6 text-left'>
                    <div className='flex items-center'>
                      <FaClock className='mr-2' />
                      {employee.clockIn}
                    </div>
                  </td>
                  <td className='py-3 px-6 text-left'>
                    {employee.clockOut ? (
                      <div className='flex items-center'>
                        <FaClock className='mr-2' />
                        {employee.clockOut}
                      </div>
                    ) : (
                      'Not clocked out'
                    )}
                  </td>
                  <td className='py-3 px-6 text-left'>
                    {employee.status === 'in' ? (
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
      </div>
    </MainLayout>
  );
};

export default EmployeeAttendanceDetails;
