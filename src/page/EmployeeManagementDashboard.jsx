import React, { useEffect, useState } from 'react';
import { FaSearch, FaFileExport, FaFilePdf } from 'react-icons/fa';
import { IoMdAddCircle } from 'react-icons/io';
import MainLayout from '../components/MainLayout';
import axiosInstance from '../ultils/axios/axiosInstance';
import Loading from '../components/Loading';
import { getUserLocalStorageItem } from '../ultils';
import useDebounce from '../hooks/useDebounce';
import EmployeeList from '../components/EmployeeList';
import { useNavigate } from 'react-router-dom';

const EmployeeManagementDashboard = () => {
  const navigate = useNavigate();

  const user = getUserLocalStorageItem();
  const [employees, setEmployees] = useState([]);
  const [employeeFilter, setEmployeeFilter] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const debounceSearchItem = useDebounce(searchTerm, 500);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectChange = (event) => {
    const departmentValue = event.target.value;

    if (departmentValue === '') {
      setEmployeeFilter([]);
    }

    setSelectedDepartment(departmentValue);
    setIsLoading(true);
    setEmployeeFilter(
      employees.filter((emp) => emp?.deparment === departmentValue)
    );
    setIsLoading(false);
  };

  const handleExportPDF = async () => {
    try {
      const response = await axiosInstance.get(
        `device/export/employee/BC5BPV21X0`,
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

  const handleAddNewEmployee = () => {
    navigate('/employee/register');
  };

  useEffect(() => {
    const getEmployees = async () => {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `device/employee/${user?.device_id}`
      );
      setIsLoading(false);
      if (response.status === 200) {
        setEmployees(response?.data?.data);
      }
    };

    getEmployees();
  }, []);

  useEffect(() => {
    if (debounceSearchItem) {
      const filtered = employees.filter((employee) =>
        `${employee.first_name} ${employee.last_name}`
          .toLowerCase()
          .includes(debounceSearchItem.toLowerCase())
      );
      setEmployeeFilter(filtered);
    } else {
      setEmployeeFilter(employees); // Show all if search term is empty
    }
  }, [debounceSearchItem, employees]);

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

          <select
            className='w-full md:w-1/4 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500'
            value={selectedDepartment} // Bind the selected value to the state
            onChange={handleSelectChange} // Handle value change
          >
            <option value=''>All Departments</option>
            <option value='Human Resource'>Human Resource</option>
            <option value='Development Team'>Development Team</option>
            <option value='Test Team'>Test Team</option>
          </select>

          <div className='w-full md:w-auto mt-4 md:mt-0 flex space-x-4'>
            <button
              onClick={handleExportPDF}
              className='flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300'
            >
              <FaFilePdf className='mr-2' />
              Export File
            </button>
            <button
              onClick={handleAddNewEmployee}
              className='flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300'
            >
              <IoMdAddCircle className='mr-2' />
              Add New
            </button>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {isLoading ? (
            <div className='flex items-center justify-center '>
              <Loading isLoading={isLoading} />
            </div>
          ) : (
            <EmployeeList
              employees={
                selectedDepartment === '' && searchTerm === ''
                  ? employees
                  : employeeFilter
              }
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default EmployeeManagementDashboard;
