import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import { Activity, Heart, TrendingUp, Apple, Dumbbell, Clock } from 'lucide-react'
import { healthProfileAPI } from '../services/api'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const [healthProfile, setHealthProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHealthProfile()
  }, [])

  const loadHealthProfile = async () => {
    try {
      const response = await healthProfileAPI.get()
      setHealthProfile(response.data)
    } catch (error) {
      console.log('Health profile not set up yet')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    )
  }

  if (!healthProfile) {
    return (
      <div className="container mx-auto py-12">
        <Card className="text-center">
          <Heart size={48} className="mx-auto mb-4 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold mb-2">Welcome to Healdiet!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Let's get started by setting up your health profile so we can create personalized meal plans for you.
          </p>
          <Button variant="primary" size="lg">
            <a href="/health-profile">Complete Your Profile</a>
          </Button>
        </Card>
      </div>
    )
  }

  const stats = [
    {
      icon: Apple,
      label: 'Daily Calories',
      value: `${healthProfile.target_calories?.toFixed(0) || '-'} kcal`,
      color: 'text-orange-500'
    },
    {
      icon: Dumbbell,
      label: 'Protein Target',
      value: `${healthProfile.target_protein?.toFixed(1) || '-'}g`,
      color: 'text-red-500'
    },
    {
      icon: TrendingUp,
      label: 'BMI',
      value: `${healthProfile.bmi?.toFixed(1) || '-'}`,
      color: 'text-blue-500'
    },
    {
      icon: Activity,
      label: 'Activity Level',
      value: healthProfile.activity_level?.toUpperCase() || '-',
      color: 'text-green-500'
    }
  ]

  const conditions = healthProfile.medical_conditions || []
  const conditionColors = {
    diabetes: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    ckd: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    hypertension: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    obesity: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <Card key={idx}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <Icon size={32} className={`${stat.color}`} />
              </div>
            </Card>
          )
        })}
      </div>

      {/* Health Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Medical Conditions */}
        <Card>
          <h3 className="text-xl font-bold mb-4">Medical Conditions</h3>
          {conditions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {conditions.map((condition, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${conditionColors[condition] || 'bg-gray-200 text-gray-800 dark:bg-gray-700'}`}
                >
                  {condition.charAt(0).toUpperCase() + condition.slice(1)}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No medical conditions specified</p>
          )}
        </Card>

        {/* Dietary Restrictions */}
        <Card>
          <h3 className="text-xl font-bold mb-4">Dietary Restrictions</h3>
          {healthProfile.dietary_restrictions?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {healthProfile.dietary_restrictions.map((restriction, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-semibold"
                >
                  {restriction}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No dietary restrictions</p>
          )}
        </Card>
      </div>

      {/* Nutritional Targets */}
      <Card>
        <h3 className="text-xl font-bold mb-6">Daily Nutritional Targets</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Carbohydrates</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {healthProfile.target_carbs?.toFixed(0) || '-'}g
            </p>
            <p className="text-xs text-gray-500 mt-1">{((healthProfile.target_carbs / healthProfile.target_calories * 400) || 0).toFixed(0)}% of calories</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Protein</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {healthProfile.target_protein?.toFixed(0) || '-'}g
            </p>
            <p className="text-xs text-gray-500 mt-1">{((healthProfile.target_protein / healthProfile.target_calories * 400) || 0).toFixed(0)}% of calories</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Fat</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {healthProfile.target_fat?.toFixed(0) || '-'}g
            </p>
            <p className="text-xs text-gray-500 mt-1">{((healthProfile.target_fat / healthProfile.target_calories * 900) || 0).toFixed(0)}% of calories</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Fiber</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {healthProfile.target_fiber?.toFixed(0) || '-'}g
            </p>
            <p className="text-xs text-gray-500 mt-1">Daily recommendation</p>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4">
        <Button variant="primary" size="lg">
          <a href="/meal-plans">Generate Meal Plan</a>
        </Button>
        <Button variant="secondary" size="lg">
          <a href="/health-profile">Update Profile</a>
        </Button>
      </div>
    </div>
  )
}
