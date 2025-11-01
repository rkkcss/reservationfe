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
import SettingsMyServices from './pages/SettingsMyServices'
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

function App() {
  return (
    <Routes>
      <Route path="/appointment/:modifierToken" element={<CancelAppointment />} />
      <Route path="/business/:businessId" element={<BusinessPage />} />
      <Route element={<HomeLayout />}>
        <Route path="/register" element={<Register />} />
        <Route path="/pricing" element={<PricePage />} />
        <Route index element={<Home />} />
        <Route path="/home" element={<Home />} />

        <Route path="/about" element={<AboutPage />} />

        <Route element={<ProtectedRoute allowedRoles={[Authorities.ROLE_USER]} />}>
          <Route path="settings" element={<Settings />}>
            <Route path="profile" element={<SettingsProfile />} />
            <Route path="my-services" element={<SettingsMyServices />} />
            <Route path="opening-hours" element={<SettingsOpeningHours />} />
            <Route path="business" element={<SettingsBusiness />} />
            <Route path="guests" element={<SettingsGuests />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[Authorities.ROLE_USER]} />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="calendar" element={<CalendarLayout />} />
        </Route>
        <Route element={<NotFound />} path="*" />
      </Route>
      <Route path="/account/activate" element={<RegisterActivation />} />
    </Routes>
  )
}

export default App
