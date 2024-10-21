export const getUserLocalStorageItem = () => {
  const userJson = localStorage.getItem('user');
  const userData =
    userJson !== 'undefined' && userJson !== null ? JSON.parse(userJson) : null;
  return userData;
};

export const getTokenLocalStorageItem = () => {
  const tokenJson = localStorage.getItem('token');
  return tokenJson !== 'undefined' && tokenJson !== null
    ? JSON.parse(tokenJson)
    : null;
};

export const getRefreshTokenLocalStorageItem = () => {
  const refreshTokenJson = localStorage.getItem('refreshToken');
  return refreshTokenJson !== 'undefined' && refreshTokenJson !== null
    ? JSON.parse(refreshTokenJson)
    : null;
};

export const clearLocalStorage = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
};

export const getFullNameUser = (user) => {
  return `${user.first_name} ${user.last_name}`;
};

export const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
};

export const formatDateForServer = (dateParam) => {
  const [day, month] = dateParam
    .split('/')
    .map((part) => part.padStart(2, '0'));
  const year = new Date().getFullYear();

  return `${year}/${month}/${day}`;
};

export const getHistoryDate = () => {
  const timestamp = '2024-08-28T21:44:37';
  const dateObject = new Date(timestamp);
  const formattedDate = `${dateObject.getFullYear()}/${String(
    dateObject.getMonth() + 1
  ).padStart(2, '0')}/${String(dateObject.getDate()).padStart(2, '0')}`;
  return formattedDate;
};

export const getTimeFromDate = (timestamp) => {
  const dateObject = new Date(timestamp);

  const hours = String(dateObject.getHours()).padStart(2, '0');
  const minutes = String(dateObject.getMinutes()).padStart(2, '0');

  // Determine AM or PM
  const period = hours >= 12 ? 'pm' : 'am';

  const formattedTime = `${hours}:${minutes} ${period}`;

  return formattedTime;
};
