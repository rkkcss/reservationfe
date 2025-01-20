import './App.css'
import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import BusinessPage from './pages/BusinessPage'
import HomeLayout from './layout/HomeLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Settings from './pages/Settings'
import SettingsEmployees from './components/SettingsEmployees'

function App() {
  return (
    <div className="text-custom-gray container mx-auto min-h-svh">
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path="/" index element={<Home />} />
          <Route path="/business/:businessId" element={<BusinessPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/settings" element={<Settings />}>
              <Route path="employees" element={<SettingsEmployees />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </div>
  )
}

export default App
