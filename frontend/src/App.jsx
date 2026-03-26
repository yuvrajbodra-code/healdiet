import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Navigation from './components/Navigation'
import Dashboard from './pages/Dashboard'
import HealthProfile from './pages/HealthProfile'
import MealPlans from './pages/MealPlans'
import MealPlanDetail from './pages/MealPlanDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import { useAuthStore } from './store/authStore'
import { useThemeStore } from './store/themeStore'

function App() {
  const { isAuthenticated, token } = useAuthStore()
  const { isDark } = useThemeStore()

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return (
    <BrowserRouter>
      <div className="app">
        {isAuthenticated && <Navigation />}
        <Routes>
          {!isAuthenticated ? (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/health-profile" element={<HealthProfile />} />
              <Route path="/meal-plans" element={<MealPlans />} />
              <Route path="/meal-plans/:id" element={<MealPlanDetail />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </>
          )}
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
