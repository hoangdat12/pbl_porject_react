import './App.css';
import EmployeeHome from './page/EmployeeHome';
import EmployeeManagementDashboard from './page/EmployeeManagementDashboard';
import EmployeeRollCall from './page/EmployeeRollCall';
import StreamingVideoPage from './page/StreamingVideoPage';
import EmployeeAttendanceDetails from './page/EmployeeAttendanceDetails';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import RegisterEmployee from './page/RegisterEmployee';
import UserInformation from './page/UserInformation';
import ForgotPassword from './page/ForgotPassword';
import NotAuthorized from './page/NotAuthorized';
import Login from './page/Login';
import Setting from './page/Setting';
import IoTControlDevice from './page/Test';
import ESP32CameraComponent from './page/ESP32CameraComponent';
import Register from './page/Register';
import ProtectedRoutes from './ultils/ProtectedRoute';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

          <Route element={<ProtectedRoutes />}>
            <Route path='/setting' element={<Setting />} />
            <Route path='/employee/attendence' element={<EmployeeRollCall />} />
            <Route
              path='/employee/attendence/:employeeId'
              element={<EmployeeAttendanceDetails />}
            />
            <Route path='/' element={<EmployeeHome />} />
            <Route
              path='/employee/management'
              element={<EmployeeManagementDashboard />}
            />
            <Route path='/employee/register' element={<RegisterEmployee />} />
            <Route
              path='/setting/user-information/:userId'
              element={<UserInformation />}
            />
            <Route
              path='/setting/forgot-password'
              element={<ForgotPassword />}
            />
            <Route path='/not-authorized' element={<NotAuthorized />} />
            <Route path='/device' element={<StreamingVideoPage />} />
            <Route path='/device/check-in' element={<ESP32CameraComponent />} />
            <Route path='/test' element={<IoTControlDevice />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
