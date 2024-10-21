import React, { useState, useEffect } from 'react';
import {
  FaPowerOff,
  FaCog,
  FaThermometerHalf,
  FaTint,
  FaBolt,
} from 'react-icons/fa';
import { IoIosWarning } from 'react-icons/io';

const IoTControlDevice = () => {
  const [deviceOn, setDeviceOn] = useState(false);
  const [temperature, setTemperature] = useState(22);
  const [humidity, setHumidity] = useState(50);
  const [powerConsumption, setPowerConsumption] = useState(0);
  const [schedule, setSchedule] = useState({ start: '', end: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      if (deviceOn) {
        setTemperature((prev) => prev + Math.random() * 0.5 - 0.25);
        setHumidity((prev) =>
          Math.max(0, Math.min(100, prev + Math.random() * 2 - 1))
        );
        setPowerConsumption((prev) => prev + Math.random() * 0.1);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [deviceOn]);

  const handleToggle = () => {
    setDeviceOn(!deviceOn);
    if (!deviceOn) {
      setPowerConsumption(0);
    }
  };

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setSchedule((prev) => ({ ...prev, [name]: value }));
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!schedule.start || !schedule.end) {
      setError('Please set both start and end times.');
      return;
    }
    setError('');
    // Here you would typically send the schedule to your backend
    console.log('Schedule set:', schedule);
  };

  return (
    <div className='max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg'>
      <h1 className='text-3xl font-bold mb-6 text-center text-blue-600'>
        IoT Device Control Panel
      </h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-xl font-semibold mb-4'>Device Controls</h2>
          <div className='flex items-center justify-between mb-4'>
            <span className='text-lg'>Power</span>
            <button
              onClick={handleToggle}
              className={`flex items-center justify-center w-16 h-8 rounded-full focus:outline-none transition-colors duration-300 ${
                deviceOn ? 'bg-green-500' : 'bg-gray-300'
              }`}
              aria-label={deviceOn ? 'Turn off device' : 'Turn on device'}
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                  deviceOn ? 'translate-x-8' : ''
                }`}
              />
            </button>
          </div>
          <div className='mb-4'>
            <label
              htmlFor='temperatureControl'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Temperature Control
            </label>
            <input
              type='range'
              id='temperatureControl'
              min='16'
              max='30'
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className='w-full'
              disabled={!deviceOn}
            />
            <div className='text-center mt-2'>{temperature.toFixed(1)}°C</div>
          </div>
        </div>

        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-xl font-semibold mb-4'>Device Status</h2>
          <div className='space-y-4'>
            <div className='flex items-center'>
              <FaThermometerHalf className='text-red-500 mr-2' size={24} />
              <span>Temperature: {temperature.toFixed(1)}°C</span>
            </div>
            <div className='flex items-center'>
              <FaTint className='text-blue-500 mr-2' size={24} />
              <span>Humidity: {humidity.toFixed(1)}%</span>
            </div>
            <div className='flex items-center'>
              <FaBolt className='text-yellow-500 mr-2' size={24} />
              <span>Power Consumption: {powerConsumption.toFixed(2)} kWh</span>
            </div>
          </div>
        </div>

        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-xl font-semibold mb-4'>Device Settings</h2>
          <form onSubmit={handleScheduleSubmit}>
            <div className='mb-4'>
              <label
                htmlFor='startTime'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Start Time
              </label>
              <input
                type='time'
                id='startTime'
                name='start'
                value={schedule.start}
                onChange={handleScheduleChange}
                className='w-full p-2 border rounded'
                required
              />
            </div>
            <div className='mb-4'>
              <label
                htmlFor='endTime'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                End Time
              </label>
              <input
                type='time'
                id='endTime'
                name='end'
                value={schedule.end}
                onChange={handleScheduleChange}
                className='w-full p-2 border rounded'
                required
              />
            </div>
            <button
              type='submit'
              className='w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300'
              disabled={!deviceOn}
            >
              Set Schedule
            </button>
          </form>
        </div>

        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-xl font-semibold mb-4'>System Messages</h2>
          {error && (
            <div
              className='flex items-center bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4'
              role='alert'
            >
              <IoIosWarning className='flex-shrink-0 mr-2' size={24} />
              <span>{error}</span>
            </div>
          )}
          {!error && (
            <div className='text-gray-600'>
              No errors or warnings at this time.
            </div>
          )}
        </div>
      </div>

      <div className='mt-8 text-center text-sm text-gray-500'>
        <p>For support, please contact our helpdesk at support@iotdevice.com</p>
      </div>
    </div>
  );
};

export default IoTControlDevice;
