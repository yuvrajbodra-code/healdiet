import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE,
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  register: (email, username, password, fullName) =>
    api.post('/auth/register', { email, username, password, full_name: fullName }),
  
  login: (email, password) =>
    api.post('/auth/login', { email, password })
}

export const healthProfileAPI = {
  create: (profileData) =>
    api.post('/health-profile/create', profileData),
  
  get: () =>
    api.get('/health-profile/'),
  
  update: (profileData) =>
    api.put('/health-profile/', profileData)
}

export const mealPlanAPI = {
  generate: (planName, description, durationDays) =>
    api.post('/meal-plans/generate', {
      plan_name: planName,
      plan_description: description,
      duration_days: durationDays
    }),
  
  getAll: () =>
    api.get('/meal-plans/'),
  
  getOne: (planId) =>
    api.get(`/meal-plans/${planId}`),
  
  delete: (planId) =>
    api.delete(`/meal-plans/${planId}`)
}

export default api
