import React from 'react';
import { format, parseISO } from 'date-fns';
import { FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CheckInHistoryTable = ({ histories }) => {
  const navigate = useNavigate();

  const handleNavigate = (userId, date) => {
    navigate(`/employee/attendence/${userId}/${date}`);
  };
  return (
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
        {histories?.length !== 0 ? (
          <tbody className='bg-white divide-y divide-gray-200'>
            {histories?.map((entry) => (
              <tr
                onClick={() => handleNavigate(entry?.id, entry?.created_date)}
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
                      ? format(parseISO(entry?.created_at), 'HH:mm:ss')
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
        ) : (
          <tbody className='w-full'>
            <tr>
              <td colSpan={5} className='text-center pt-10 pb-6 text-gray-500'>
                No employee data available
              </td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
};

export default CheckInHistoryTable;
