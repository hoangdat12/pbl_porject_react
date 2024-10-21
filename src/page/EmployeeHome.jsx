import React, { useState } from 'react';
import {
  FiUsers,
  FiCalendar,
  FiBriefcase,
  FiPlus,
  FiSearch,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import MainLayout from '../components/MainLayout';

const employeeData = [
  {
    name: 'John Doe',
    position: 'Software Engineer',
    department: 'Engineering',
  },
  {
    name: 'Jane Smith',
    position: 'Marketing Manager',
    department: 'Marketing',
  },
  {
    name: 'Mike Johnson',
    position: 'HR Specialist',
    department: 'Human Resources',
  },
  { name: 'Sarah Brown', position: 'Product Manager', department: 'Product' },
  { name: 'Tom Wilson', position: 'Financial Analyst', department: 'Finance' },
];

const upcomingEvents = [
  { id: 1, title: 'Team Meeting', date: '2023-06-15' },
  { id: 2, title: 'Product Launch', date: '2023-06-20' },
  { id: 3, title: 'Training Session', date: '2023-06-25' },
];

const departmentData = [
  { name: 'Engineering', employees: 50 },
  { name: 'Marketing', employees: 30 },
  { name: 'HR', employees: 15 },
  { name: 'Product', employees: 25 },
  { name: 'Finance', employees: 20 },
];

const EmployeeHome = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const filteredEmployees = employeeData.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className='min-h-screen bg-gray-100'>
        <main className='container mx-auto px-4 py-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h2 className='text-xl font-semibold mb-4 flex items-center'>
                <FiUsers className='mr-2' /> Total Employees
              </h2>
              <p className='text-3xl font-bold text-blue-600'>
                {employeeData.length}
              </p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h2 className='text-xl font-semibold mb-4 flex items-center'>
                <FiBriefcase className='mr-2' /> Departments
              </h2>
              <p className='text-3xl font-bold text-green-600'>
                {departmentData.length}
              </p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h2 className='text-xl font-semibold mb-4 flex items-center'>
                <FiCalendar className='mr-2' /> Upcoming Events
              </h2>
              <p className='text-3xl font-bold text-purple-600'>
                {upcomingEvents.length}
              </p>
            </div>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h2 className='text-xl font-semibold mb-4'>
                Department Overview
              </h2>
              <ResponsiveContainer width='100%' height={300}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey='employees' fill='#3b82f6' />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h2 className='text-xl font-semibold mb-4'>Upcoming Events</h2>
              <ul className='space-y-4'>
                {upcomingEvents.map((event) => (
                  <li
                    key={event.id}
                    className='flex items-center justify-between'
                  >
                    <span>{event.title}</span>
                    <span className='text-gray-500'>{event.date}</span>
                  </li>
                ))}
              </ul>
              <button className='mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 flex items-center'>
                <FiPlus className='mr-2' /> Add Event
              </button>
            </div>
          </div>

          <div className='bg-white p-6 rounded-lg shadow-md mb-8'>
            <h2 className='text-xl font-semibold mb-4'>Employee Directory</h2>
            <div className='mb-4 flex items-center'>
              <FiSearch className='text-gray-400 mr-2' />
              <input
                type='text'
                placeholder='Search employees...'
                className='border rounded px-2 py-1 w-full'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {filteredEmployees.map((employee, index) => (
                <div
                  key={index}
                  className='border rounded p-4 hover:shadow-md transition duration-300'
                >
                  <h3 className='font-semibold'>{employee.name}</h3>
                  <p className='text-gray-600'>{employee.position}</p>
                  <p className='text-gray-500'>{employee.department}</p>
                </div>
              ))}
            </div>
          </div>

          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-semibold mb-4'>Quick Actions</h2>
            <div className='flex flex-wrap gap-4'>
              <Link
                to={'/employee/register'}
                className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300 flex items-center'
              >
                <FiPlus className='mr-2' /> Add Employee
              </Link>
              <button className='bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition duration-300 flex items-center'>
                <FiCalendar className='mr-2' /> Approve Time-Off
              </button>
              <button className='bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition duration-300 flex items-center'>
                <FiUsers className='mr-2' /> Send Announcement
              </button>
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  );
};

export default EmployeeHome;
