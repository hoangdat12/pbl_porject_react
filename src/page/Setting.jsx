import React from 'react';
import { RiLockPasswordLine, RiQuestionLine } from 'react-icons/ri';
import { VscGame } from 'react-icons/vsc';
import { MdOutlinePrivacyTip } from 'react-icons/md';
import { CgProfile } from 'react-icons/cg';
import { IoMdPaper, IoIosLogOut } from 'react-icons/io';
import SettingButton from '../components/SettingButton';
import { clearLocalStorage, getUserLocalStorageItem } from '../ultils';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';

const Setting = () => {
  const navigate = useNavigate();

  const user = getUserLocalStorageItem();

  const handleLogout = async () => {
    clearLocalStorage();
    navigate('/login');
    // call api to add refresh token to blacklist
  };

  return (
    <MainLayout>
      <div className='min-h-screen bg-gray-100'>
        <div className='py-5 items-center justify-center px-4'>
          <div className='space-y-6'>
            <header className='bg-white shadow-md rounded-lg p-6'>
              <div className='flex justify-between items-center'>
                <h1 className='text-3xl font-bold text-gray-800'>
                  Employee Setting
                </h1>
              </div>
            </header>

            <div className='bg-white py-2 rounded-lg border'>
              <div className='px-4'>
                <h1 className='font-semibold text-2xl'>Setting your account</h1>
              </div>
              <ul className='w-full text-sm font-medium space-y-4 rounded-lg px-4 py-4'>
                <SettingButton
                  Icon={RiLockPasswordLine}
                  title={'Get Account Password'}
                  link={'/setting/forgot-password'}
                />
                <SettingButton
                  Icon={CgProfile}
                  title={'User Information'}
                  link={`/setting/user-information/${user?.id}`}
                />
                <SettingButton
                  Icon={RiLockPasswordLine}
                  title={"Create device's account"}
                  link={'/employee/register'}
                />
              </ul>
            </div>

            <div className='bg-white py-2 rounded-lg border'>
              <div className='px-4'>
                <h1 className='font-semibold text-2xl'>Think Tittle</h1>
              </div>
              <ul className='w-full text-sm font-medium space-y-4 rounded-lg px-4 py-4'>
                <SettingButton
                  Icon={VscGame}
                  title={'Terms of service'}
                  link={'/account/terms'}
                />
                <SettingButton
                  Icon={MdOutlinePrivacyTip}
                  title={'Privacy Policy'}
                  link={'/privacy'}
                />
                <SettingButton
                  Icon={IoMdPaper}
                  title={'Community guidelines'}
                  link={'/guildline'}
                />
                <SettingButton
                  Icon={RiQuestionLine}
                  title={'Supports'}
                  link={'/supports'}
                />
                <li
                  onClick={handleLogout}
                  className='w-full py-2 px-4 bg-gray-100 rounded-md'
                >
                  <span className='flex items-center justify-start space-x-2 text-lg'>
                    <IoIosLogOut />
                    <span>Logout</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Setting;
