import React, { useState, useEffect } from 'react';
import {
  FaSearch,
  FaCalendarAlt,
  FaClock,
  FaBuilding,
  FaBriefcase,
  FaSortAmountDown,
} from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EmployeeRollCallSearch = () => {
  const [searchDate, setSearchDate] = useState(new Date());
  const [searchTime, setSearchTime] = useState('');
  const [nameSearch, setNameSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [error, setError] = useState('');
  const [isDropDown, setIsDropDown] = useState(false);

  // Dummy data for demonstration
  useEffect(() => {
    setEmployees([
      {
        id: 1,
        name: 'John Doe',
        department: 'IT',
        position: 'Developer',
        hireDate: '2020-01-15',
      },
      {
        id: 2,
        name: 'Jane Smith',
        department: 'HR',
        position: 'Manager',
        hireDate: '2019-05-20',
      },
      {
        id: 3,
        name: 'Bob Johnson',
        department: 'Finance',
        position: 'Analyst',
        hireDate: '2021-03-10',
      },
      {
        id: 4,
        name: 'Alice Brown',
        department: 'Marketing',
        position: 'Coordinator',
        hireDate: '2022-07-01',
      },
    ]);
  }, []);

  const handleSearch = () => {
    if (!searchDate || !searchTime) {
      setError('Please select both date and time');
      return;
    }

    setError('');

    const filtered = employees.filter((employee) => {
      return (
        employee.name.toLowerCase().includes(nameSearch.toLowerCase()) &&
        (!department || employee.department === department) &&
        (!position || employee.position === position)
      );
    });

    filtered.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'department')
        return a.department.localeCompare(b.department);
      if (sortBy === 'hireDate')
        return new Date(a.hireDate) - new Date(b.hireDate);
      return 0;
    });

    setFilteredEmployees(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [nameSearch, department, position, sortBy]);

  return (
    <div className='max-w-4xl mx-auto p-6 bg-white rounded-lg shadow'>
      <h1
        onClick={() => setIsDropDown(!isDropDown)}
        className='text-3xl font-bold text-gray-800'
      >
        Employee Roll-Call Search
      </h1>

      {isDropDown && (
        <div className='mt-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
            <div>
              <label
                htmlFor='datePicker'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Date
              </label>
              <div className='relative'>
                <DatePicker
                  id='datePicker'
                  selected={searchDate}
                  onChange={(date) => setSearchDate(date)}
                  className='w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
                  aria-label='Select date'
                />
                <FaCalendarAlt className='absolute right-3 top-3 text-gray-400' />
              </div>
            </div>
            <div>
              <label
                htmlFor='timePicker'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Time
              </label>
              <div className='relative'>
                <input
                  type='time'
                  id='timePicker'
                  value={searchTime}
                  onChange={(e) => setSearchTime(e.target.value)}
                  className='w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
                  aria-label='Select time'
                />
                <FaClock className='absolute right-3 top-3 text-gray-400' />
              </div>
            </div>
          </div>

          <div className='mb-6'>
            <label
              htmlFor='nameSearch'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Search by Name
            </label>
            <div className='relative'>
              <input
                type='text'
                id='nameSearch'
                value={nameSearch}
                onChange={(e) => setNameSearch(e.target.value)}
                className='w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
                placeholder='Enter employee name'
                aria-label='Search by name'
              />
              <FaSearch className='absolute left-3 top-3 text-gray-400' />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
            <div>
              <label
                htmlFor='department'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Department
              </label>
              <div className='relative'>
                <select
                  id='department'
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className='w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 appearance-none'
                  aria-label='Select department'
                >
                  <option value=''>All Departments</option>
                  <option value='IT'>IT</option>
                  <option value='HR'>HR</option>
                  <option value='Finance'>Finance</option>
                  <option value='Marketing'>Marketing</option>
                </select>
                <FaBuilding className='absolute right-3 top-3 text-gray-400' />
              </div>
            </div>
            <div>
              <label
                htmlFor='position'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Position
              </label>
              <div className='relative'>
                <select
                  id='position'
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className='w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 appearance-none'
                  aria-label='Select position'
                >
                  <option value=''>All Positions</option>
                  <option value='Developer'>Developer</option>
                  <option value='Manager'>Manager</option>
                  <option value='Analyst'>Analyst</option>
                  <option value='Coordinator'>Coordinator</option>
                </select>
                <FaBriefcase className='absolute right-3 top-3 text-gray-400' />
              </div>
            </div>
            <div>
              <label
                htmlFor='sortBy'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Sort By
              </label>
              <div className='relative'>
                <select
                  id='sortBy'
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className='w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 appearance-none'
                  aria-label='Sort by'
                >
                  <option value='name'>Name</option>
                  <option value='department'>Department</option>
                  <option value='hireDate'>Hire Date</option>
                </select>
                <FaSortAmountDown className='absolute right-3 top-3 text-gray-400' />
              </div>
            </div>
          </div>

          {error && (
            <div
              className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'
              role='alert'
            >
              <p>{error}</p>
            </div>
          )}

          <button
            onClick={handleSearch}
            className='w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out'
            aria-label='Search'
          >
            Search
          </button>
        </div>
      )}
    </div>
  );
};

export default EmployeeRollCallSearch;
