import './App.css'
import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import BusinessPage from './pages/BusinessPage'
import HomeLayout from './layout/HomeLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Settings from './pages/Settings'
import SettingsProfile from './components/SettingsProfile'
import SettingsOpeningHours from './components/SettingsOpeningHours'
import { Authorities } from './helpers/types/Authorities'
import Appointments from './pages/Appointments'
import WorkingHours from './pages/WorkingHours'
import SettingsMyServices from './pages/SettingsMyServices'
import CalendarPage from './pages/Calendar/Calendar'
import AboutPage from './pages/AboutPage'
import NotFound from './pages/NotFound'
import SettingsBusiness from './components/SettingsBusiness'
import SettingsGuests from './components/SettingsGuests'
import CancelAppointment from './components/CancelAppointment'

function App() {
  return (
    <Routes>
      <Route path="/appointment/:modifierToken" element={<CancelAppointment />} />
      <Route path="/business/:businessId" element={<BusinessPage />} />
      <Route element={<HomeLayout />}>
        <Route index element={<Home />} />
        <Route path="/home" element={<Home />} />

        <Route path="/about" element={<AboutPage />} />

        <Route element={<ProtectedRoute allowedRoles={[Authorities.ROLE_USER]} />}>
          <Route path="settings" element={<Settings />}>
            <Route path="profile" element={<SettingsProfile />} />
            <Route element={<ProtectedRoute allowedRoles={[Authorities.ROLE_USER]} />}>
              <Route path="my-services" element={<SettingsMyServices />} />
              <Route path="opening-hours" element={<SettingsOpeningHours />} />
              <Route path="business" element={<SettingsBusiness />} />
              <Route path="guests" element={<SettingsGuests />} />
            </Route>
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[Authorities.ROLE_USER]} />}>
          <Route path="dashboard/appointments" element={<Appointments />} />
          <Route path="dashboard/working-hours" element={<WorkingHours />} />
          <Route path="dashboard/calendar" element={<CalendarPage />} />
        </Route>
        <Route element={<NotFound />} path="*" />
      </Route>
    </Routes>
  )
}

export default App
