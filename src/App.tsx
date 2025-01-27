import './App.css'
import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import BusinessPage from './pages/BusinessPage'
import HomeLayout from './layout/HomeLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Settings from './pages/Settings'
import SettingsEmployees from './components/SettingsEmployees'
import SettingsProfile from './components/SettingsProfile'
import SettingsOpeningHours from './components/SettingsOpeningHours'
import { Authorities } from './helpers/types/Authorities'
import Appointments from './pages/Appointments'
import WorkingHours from './pages/WorkingHours'
import SettingsMyServices from './pages/SettingsMyServices'

function App() {
  return (
    <div className="text-custom-gray container mx-auto min-h-svh">
      <Routes>
        <Route element={<HomeLayout />}>
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/business/:businessId" element={<BusinessPage />} />


          <Route element={<ProtectedRoute allowedRoles={[Authorities.ROLE_USER]} />}>
            <Route path="settings" element={<Settings />}>
              <Route path="profile" element={<SettingsProfile />} />
              <Route element={<ProtectedRoute allowedRoles={[Authorities.ROLE_EMPLOYEE, Authorities.ROLE_OWNER]} />}>
                <Route path="my-services" element={<SettingsMyServices />} />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={[Authorities.ROLE_OWNER]} />}>
                <Route path="employees" element={<SettingsEmployees />} />
                <Route path="opening-hours" element={<SettingsOpeningHours />} />
              </Route>
            </Route>
          </Route>
          <Route element={<ProtectedRoute allowedRoles={[Authorities.ROLE_EMPLOYEE, Authorities.ROLE_OWNER]} />}>
            <Route path="dashboard/appointments" element={<Appointments />} />
            <Route path="dashboard/working-hours" element={<WorkingHours />} />
          </Route>

        </Route>
      </Routes>
    </div>
  )
}

export default App
