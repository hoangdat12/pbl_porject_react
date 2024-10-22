import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { getUserLocalStorageItem } from './index';

const ProtectedRoutes = ({ children }) => {
  const location = useLocation(); // Use the useLocation hook to get the current location
  const user = getUserLocalStorageItem();
  if (user !== null) {
    return <Outlet />;
  } else {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }
};

export default ProtectedRoutes;
