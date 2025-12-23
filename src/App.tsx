import './App.css'
import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import { BusinessPageWrap } from './pages/PublicBusiness/BusinessPage'
import HomeLayout from './layout/HomeLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Settings from './pages/Settings'
import SettingsProfile from './components/SettingsProfile'
import SettingsOpeningHours from './components/SettingsOpeningHours'
import { Authorities } from './helpers/types/Authorities'
import SettingsMyServices from './components/SettingsMyServices'
import SettingsEmployees from './pages/SettingsEmployee/SettingsEmployees'
import AboutPage from './pages/AboutPage'
import NotFound from './pages/NotFound'
import SettingsBusiness from './components/SettingsBusiness'
import SettingsGuests from './components/SettingsGuests'
import CancelAppointment from './components/CancelAppointment'
import PricePage from './pages/PricePage'
import Dashboard from './pages/Dashboard'
import CalendarLayout from './layout/CalendarLayout'
import Register from './pages/Register'
import RegisterActivation from './pages/Activations/RegisterActivation'
import { useEffect } from 'react'
import { fetchCsrfToken } from './helpers/queries/account-queries'
import SettingsSecurity from './components/SettingsSecurity'
import RequireBusiness from './components/RequireBusiness'
import ChooseBusiness from './pages/ChooseBusiness'
import EmployeeLayout from './pages/SettingsEmployee/EmployeeLayout'
import ProtectedEmployeeRoles from './components/ProtectedEmployeeRoles'
import { BUSINESS_PERMISSIONS } from './helpers/types/BusinessPermission'
import { setupNotifications } from './utils/notificationConfig'
import EmployeeActivation from './pages/Activations/EmployeeActivation'
import LoginModal from './components/Login/LoginModal'

function App() {

  useEffect(() => {
    fetchCsrfToken();
    //notification config
    setupNotifications();
  }, []);

  return (
    <>
      <LoginModal />
      <Routes>
        <Route path="/employee-invite/activate" element={<EmployeeActivation />} />
        <Route path="/appointment/:modifierToken" element={<CancelAppointment />} />
        <Route path="/business/:businessId" element={<BusinessPageWrap />} />
        <Route element={<HomeLayout />}>
          <Route path="/register" element={<Register />} />
          <Route path="/pricing" element={<PricePage />} />
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route element={<NotFound />} path="/not-found" />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={[Authorities.ROLE_USER]} />}>
          <Route path="/choose-business" element={<ChooseBusiness />}></Route>
          <Route element={<RequireBusiness />}>
            <Route element={<HomeLayout />} >
              <Route path="settings" element={<Settings />}>
                <Route path="profile" element={<SettingsProfile />} />
                <Route element={<ProtectedEmployeeRoles permissions={[BUSINESS_PERMISSIONS.VIEW_SERVICES]} />} >
                  <Route path="my-services" element={<SettingsMyServices />} />
                </Route>
                <Route element={<ProtectedEmployeeRoles permissions={[BUSINESS_PERMISSIONS.EDIT_OWN_WORKING_HOURS]} />}>
                  <Route path="opening-hours" element={<SettingsOpeningHours />} />
                </Route>
                <Route element={<ProtectedEmployeeRoles permissions={[BUSINESS_PERMISSIONS.MANAGE_BUSINESS_SETTINGS]} />}>
                  <Route path="business" element={<SettingsBusiness />} />
                </Route>
                <Route path="guests" element={<SettingsGuests />} />
                <Route path="security" element={<SettingsSecurity />} />
                <Route element={<ProtectedEmployeeRoles permissions={[BUSINESS_PERMISSIONS.MANAGE_EMPLOYEES,]} />} >
                  <Route path="employees" element={<SettingsEmployees />} />
                  <Route path="employee/:employeeId" element={<EmployeeLayout />} />
                </Route>
              </Route>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="calendar" element={<CalendarLayout />} />
            </Route>
          </Route>
        </Route>
        <Route path="/account/activate" element={<RegisterActivation />} />
      </Routes >
    </>
  )
}

export default App
