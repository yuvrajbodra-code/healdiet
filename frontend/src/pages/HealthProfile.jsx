import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import { healthProfileAPI } from '../services/api'
import toast from 'react-hot-toast'
import { AlertCircle, Save } from 'lucide-react'

export default function HealthProfile() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    age: '',
    gender: 'M',
    height: '',
    weight: '',
    medical_conditions: [],
    allergies: '',
    dietary_restrictions: [],
    activity_level: 'moderate',
    cuisine_preferences: [],
    disliked_foods: [],
    meal_frequency: 3
  })

  const medicalConditions = ['diabetes', 'ckd', 'hypertension', 'obesity']
  const dietaryRestrictions = ['vegetarian', 'vegan', 'gluten-free', 'lactose-free', 'nut-free']
  const activityLevels = ['sedentary', 'light', 'moderate', 'active', 'very-active']

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const response = await healthProfileAPI.get()
      setFormData(response.data)
    } catch (error) {
      console.log('Creating new profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
          ? [...(prev[name] || []), value]
          : (prev[name] || []).filter(item => item !== value)
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (formData.id) {
        await healthProfileAPI.update(formData)
      } else {
        await healthProfileAPI.create(formData)
      }
      toast.success('Health profile saved successfully!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Health Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <h2 className="text-2xl font-bold mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              placeholder="30"
              required
            />

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:border-blue-500"
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <Input
              label="Height (cm)"
              name="height"
              type="number"
              step="0.1"
              value={formData.height}
              onChange={handleChange}
              placeholder="170"
              required
            />

            <Input
              label="Weight (kg)"
              name="weight"
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={handleChange}
              placeholder="75"
              required
            />
          </div>
        </Card>

        {/* Medical Information */}
        <Card>
          <h2 className="text-2xl font-bold mb-6">Medical Information</h2>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
              Medical Conditions *
            </label>
            <div className="space-y-2">
              {medicalConditions.map(condition => (
                <label key={condition} className="flex items-center">
                  <input
                    type="checkbox"
                    name="medical_conditions"
                    value={condition}
                    checked={formData.medical_conditions?.includes(condition)}
                    onChange={handleChange}
                    className="w-4 h-4 rounded cursor-pointer"
                  />
                  <span className="ml-2 capitalize text-gray-700 dark:text-gray-300">{condition}</span>
                </label>
              ))}
            </div>
          </div>

          <Input
            label="Allergies"
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            placeholder="e.g., peanuts, shellfish"
          />

          <div>
            <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
              Dietary Restrictions
            </label>
            <div className="space-y-2">
              {dietaryRestrictions.map(restriction => (
                <label key={restriction} className="flex items-center">
                  <input
                    type="checkbox"
                    name="dietary_restrictions"
                    value={restriction}
                    checked={formData.dietary_restrictions?.includes(restriction)}
                    onChange={handleChange}
                    className="w-4 h-4 rounded cursor-pointer"
                  />
                  <span className="ml-2 capitalize text-gray-700 dark:text-gray-300">{restriction}</span>
                </label>
              ))}
            </div>
          </div>
        </Card>

        {/* Lifestyle Information */}
        <Card>
          <h2 className="text-2xl font-bold mb-6">Lifestyle Information</h2>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Activity Level *
            </label>
            <select
              name="activity_level"
              value={formData.activity_level}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:border-blue-500"
            >
              {activityLevels.map(level => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Meals Per Day"
            name="meal_frequency"
            type="number"
            value={formData.meal_frequency}
            onChange={handleChange}
            placeholder="3"
            required
          />
        </Card>

        {/* Preferences */}
        <Card>
          <h2 className="text-2xl font-bold mb-6">Food Preferences</h2>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Cuisine Preferences (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g., Italian, Asian, Mediterranean"
              value={Array.isArray(formData.cuisine_preferences) ? formData.cuisine_preferences.join(', ') : ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                cuisine_preferences: e.target.value.split(',').map(c => c.trim())
              }))}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Foods to Avoid (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g., spinach, red meat, mushrooms"
              value={Array.isArray(formData.disliked_foods) ? formData.disliked_foods.join(', ') : ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                disliked_foods: e.target.value.split(',').map(f => f.trim())
              }))}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </Card>

        {/* Form Actions */}
        <div className="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
