import React, { useState } from 'react';
import ConfirmModal from './ConfirmModal';
import UpdateEmployeeInformation from './UpdateEmployeeInformation';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axiosInstance from '../ultils/axios/axiosInstance';

const EmployeeList = ({ employees }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userEditInformation, setUserEditInformation] = useState({});
  const [userDeleteInformation, setUserDeleteInformation] = useState({});

  const openModal = (user) => {
    setIsModalOpen(true);
    setUserDeleteInformation(user);
  };
  const closeModal = () => setIsModalOpen(false);

  const handleConfirm = async () => {
    const response = await axiosInstance.delete(
      `account/${userDeleteInformation?.id}`
    );
    console.log(response);
    if (response.status === 200) {
      closeModal();
    }
  };

  const handleEditUserInformation = (user) => {
    setUserEditInformation(user);
    setShowModal(true);
  };

  return (
    <>
      {employees?.map((employee) => (
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
              <button
                onClick={() => handleEditUserInformation(employee)}
                className='flex items-center px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300'
              >
                <FaEdit className='mr-1' />
                Edit
              </button>
              <button
                onClick={() => openModal(employee)}
                className='flex items-center px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300'
              >
                <FaTrash className='mr-1' />
                Delete
              </button>
            </div>

            {isModalOpen && (
              <ConfirmModal
                onClose={closeModal}
                onConfirm={handleConfirm}
                employee={userDeleteInformation}
              />
            )}

            {showModal && (
              <UpdateEmployeeInformation
                userEdited={userEditInformation}
                setShowModal={setShowModal}
              />
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default EmployeeList;
