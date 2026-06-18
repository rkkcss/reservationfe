import './App.css'
import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import { BusinessPageWrap } from './pages/PublicBusiness/BusinessPage'
import HomeLayout from './layout/HomeLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Settings from './pages/Settings'
import SettingsProfile from './components/SettingsProfile'
import { Authorities } from './helpers/types/Authorities'
import SettingsMyServices from './components/SettingsMyServices'
import SettingsEmployees from './pages/SettingsEmployee/SettingsEmployees'
import NotFound from './pages/NotFound'
import SettingsBusiness from './components/SettingsBusiness'
import SettingsGuests from './components/SettingsGuests/SettingsGuests'
import CancelAppointment from './components/CancelAppointment'
import DashboardLayout from './pages/Dashboard'
import CalendarLayout from './layout/CalendarLayout'
import Register from './pages/Register'
import RegisterActivation from './pages/Activations/RegisterActivation'
import { lazy, useEffect } from 'react'
import { fetchCsrfToken } from './helpers/queries/account-queries'
import SettingsSecurity from './components/SettingsSecurity'
import RequireBusiness from './components/RequireBusiness'
import ChooseBusiness from './pages/ChooseBusiness/ChooseBusiness'
import EmployeeLayout from './pages/SettingsEmployee/EmployeeLayout'
import ProtectedEmployeeRoles from './components/ProtectedEmployeeRoles'
import { BUSINESS_PERMISSIONS } from './helpers/types/BusinessPermission'
import { setupNotifications } from './utils/notificationConfig'
import EmployeeActivation from './pages/Activations/EmployeeActivation'
import LoginModal from './components/Login/LoginModal'
import OpeningHours from './components/OpeningHours'
import OAuthSuccess from './utils/OAuthSuccess'
import LoginLayout from './layout/LoginLayout'
import PasswordResetRequest from './pages/PasswordReset/PasswordResetRequest'
import PasswordResetFinish from './pages/PasswordReset/PasswordResetFinish'
import AuthenticatedLayout from './layout/AuthenticatedLayout'
import AllNotification from './pages/AllNotification/AllNotification'
import { useTenantSlug } from './hooks/useTenantSlug'

export const AboutPage = lazy(() => import('./pages/AboutPage'));
export const PricePage = lazy(() => import('./pages/PricePage'));
export const Swagger = lazy(() => import('./pages/Swagger'));
export const CacheDebug = lazy(() => import('./pages/Admin/CacheDebug'));


function App() {
  const tenantSlug = useTenantSlug();

  useEffect(() => {
    fetchCsrfToken();
    //notification config
    setupNotifications();
  }, []);

  if (tenantSlug) {
    return (
      <Routes>
        <Route path="/appointment/:modifierToken" element={<CancelAppointment />} />
        <Route path="*" element={<BusinessPageWrap />} />
      </Routes>
    );
  }

  return (
    <>
      <LoginModal />
      <Routes>
        <Route path="/employee-invite/:token" element={<EmployeeActivation />} />
        <Route element={<HomeLayout />}>
          <Route path="/register" element={<Register />} />
          <Route path="/pricing" element={<PricePage />} />
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route element={<NotFound />} path="/not-found" />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={[Authorities.ROLE_USER]} />}>
          <Route element={<AuthenticatedLayout />} >
            <Route path="/choose-business" element={<ChooseBusiness />}></Route>
            <Route element={<RequireBusiness />}>
              <Route element={<LoginLayout />} >
                <Route path="settings" element={<Settings />}>
                  <Route path="profile" element={<SettingsProfile />} />
                  <Route element={<ProtectedEmployeeRoles permissions={[BUSINESS_PERMISSIONS.VIEW_SERVICES]} />} >
                    <Route path="my-services" element={<SettingsMyServices />} />
                  </Route>
                  <Route element={<ProtectedEmployeeRoles permissions={[BUSINESS_PERMISSIONS.EDIT_OWN_WORKING_HOURS]} />}>
                    <Route path="opening-hours" element={<OpeningHours />} />
                  </Route>
                  <Route element={<ProtectedEmployeeRoles permissions={[BUSINESS_PERMISSIONS.MANAGE_BUSINESS_SETTINGS]} />}>
                    <Route path="business" element={<SettingsBusiness />} />
                  </Route>
                  <Route path="security" element={<SettingsSecurity />} />
                  <Route element={<ProtectedEmployeeRoles permissions={[BUSINESS_PERMISSIONS.MANAGE_EMPLOYEES,]} />} >
                    <Route path="employees" element={<SettingsEmployees />} />
                    <Route path="employee/:employeeId" element={<EmployeeLayout />} />
                  </Route>
                </Route>
                <Route element={<ProtectedEmployeeRoles permissions={[BUSINESS_PERMISSIONS.VIEW_OWN_STATISTICS, BUSINESS_PERMISSIONS.VIEW_ALL_STATISTICS]} />}>
                  <Route path="dashboard" element={<DashboardLayout />} />
                </Route>
                <Route path="calendar" element={<CalendarLayout />} />
                <Route path="guests" element={<SettingsGuests />} />
                <Route path="notifications" element={<AllNotification />} />
              </Route>
            </Route>
          </Route>
        </Route>
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/account/activate" element={<RegisterActivation />} />
        <Route path="/account/reset/init" element={<PasswordResetRequest />} />
        <Route path="/account/reset/finish" element={<PasswordResetFinish />} />
        {/* ADMIN ROUTE */}

        <Route element={<ProtectedRoute allowedRoles={[Authorities.ROLE_ADMIN]} />}>
          <Route element={<Swagger />} path="/swagger"></Route>
          <Route element={<CacheDebug />} path="/debug-cache"></Route>
        </Route>
      </Routes >
    </>
  )
}

export default App
