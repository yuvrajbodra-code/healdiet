import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, Moon, Sun, LogOut } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'

export default function Navigation() {
  const [isOpen, setIsOpen] = React.useState(false)
  const { logout, user } = useAuthStore()
  const { isDark, toggleTheme } = useThemeStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="text-2xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold">H</span>
            </div>
            Healdiet
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="hover:text-blue-200 transition">Dashboard</Link>
            <Link to="/health-profile" className="hover:text-blue-200 transition">Health Profile</Link>
            <Link to="/meal-plans" className="hover:text-blue-200 transition">Meal Plans</Link>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-blue-700 transition"
              title="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="flex items-center gap-2 pl-6 border-l border-blue-500">
              <span className="text-sm">{user?.full_name || user?.email}</span>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-red-600 transition"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-blue-700 transition"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-blue-700 transition"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <Link to="/dashboard" className="block py-2 hover:text-blue-200">Dashboard</Link>
            <Link to="/health-profile" className="block py-2 hover:text-blue-200">Health Profile</Link>
            <Link to="/meal-plans" className="block py-2 hover:text-blue-200">Meal Plans</Link>
            <div className="pt-4 border-t border-blue-500 flex items-center justify-between">
              <span className="text-sm">{user?.full_name || user?.email}</span>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-red-600 transition"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
