import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import { mealPlanAPI } from '../services/api'
import toast from 'react-hot-toast'
import { ChevronLeft, FileJson } from 'lucide-react'

export default function MealPlanDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [mealPlan, setMealPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState(1)

  useEffect(() => {
    loadMealPlan()
  }, [id])

  const loadMealPlan = async () => {
    try {
      const response = await mealPlanAPI.getOne(id)
      setMealPlan(response.data)
    } catch (error) {
      toast.error('Failed to load meal plan')
      navigate('/meal-plans')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading meal plan...</p>
      </div>
    )
  }

  if (!mealPlan) {
    return (
      <div className="container mx-auto py-8">
        <p>Meal plan not found</p>
      </div>
    )
  }

  const dailyMeals = (mealPlan.meals || []).filter(meal => meal.day_number === selectedDay)
  const days = Array.from({ length: mealPlan.duration_days }, (_, i) => i + 1)

  // Calculate daily totals
  const dailyTotals = dailyMeals.reduce((acc, meal) => ({
    calories: acc.calories + (meal.calories || 0),
    protein: acc.protein + (meal.protein || 0),
    carbs: acc.carbs + (meal.carbs || 0),
    fat: acc.fat + (meal.fat || 0),
    fiber: acc.fiber + (meal.fiber || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 })

  // Nutrition pie chart data
  const macroPercentages = {
    protein: (dailyTotals.protein * 4) / dailyTotals.calories * 100 || 0,
    carbs: (dailyTotals.carbs * 4) / dailyTotals.calories * 100 || 0,
    fat: (dailyTotals.fat * 9) / dailyTotals.calories * 100 || 0,
  }

  const mealTypeColors = {
    breakfast: 'bg-orange-50 dark:bg-orange-900',
    lunch: 'bg-blue-50 dark:bg-blue-900',
    dinner: 'bg-purple-50 dark:bg-purple-900',
    snack: 'bg-green-50 dark:bg-green-900'
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/meal-plans')}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-4xl font-bold">{mealPlan.plan_name}</h1>
            <p className="text-gray-600 dark:text-gray-400">{mealPlan.plan_description}</p>
          </div>
        </div>
      </div>

      {/* Overall Plan Summary */}
      <Card className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Plan Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Duration</p>
            <p className="text-2xl font-bold">{mealPlan.duration_days} Days</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Total Calories</p>
            <p className="text-2xl font-bold">{mealPlan.total_calories?.toFixed(0)}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Total Protein</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{mealPlan.total_protein?.toFixed(0)}g</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Total Carbs</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{mealPlan.total_carbs?.toFixed(0)}g</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Total Fat</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{mealPlan.total_fat?.toFixed(0)}g</p>
          </div>
        </div>
      </Card>

      {/* Day Selector */}
      <Card className="mb-8">
        <h3 className="text-xl font-bold mb-4">Select Day</h3>
        <div className="flex flex-wrap gap-2">
          {days.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`
                px-4 py-2 rounded-lg font-semibold transition-all
                ${selectedDay === day
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                }
              `}
            >
              Day {day}
            </button>
          ))}
        </div>
      </Card>

      {/* Daily Summary */}
      <Card className="mb-8">
        <h3 className="text-xl font-bold mb-4">Day {selectedDay} - Nutritional Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Calories</p>
            <p className="text-2xl font-bold">{dailyTotals.calories.toFixed(0)}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Protein</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{dailyTotals.protein.toFixed(1)}g</p>
            <p className="text-xs text-gray-500">{macroPercentages.protein.toFixed(0)}%</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Carbs</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{dailyTotals.carbs.toFixed(1)}g</p>
            <p className="text-xs text-gray-500">{macroPercentages.carbs.toFixed(0)}%</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Fat</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{dailyTotals.fat.toFixed(1)}g</p>
            <p className="text-xs text-gray-500">{macroPercentages.fat.toFixed(0)}%</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Fiber</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{dailyTotals.fiber.toFixed(1)}g</p>
          </div>
        </div>
      </Card>

      {/* Meals for the Day */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold">Meals</h3>
        {dailyMeals.length === 0 ? (
          <Card>
            <p className="text-gray-600 dark:text-gray-400">No meals for this day</p>
          </Card>
        ) : (
          dailyMeals.map((meal, idx) => (
            <Card key={idx} className={mealTypeColors[meal.meal_type] || ''}>
              <div className="mb-4">
                <h3 className="text-2xl font-bold capitalize mb-1">{meal.meal_type}</h3>
                <p className="text-lg text-gray-600 dark:text-gray-400">{meal.meal_name}</p>
                {meal.description && <p className="text-sm text-gray-500 dark:text-gray-400">{meal.description}</p>}
              </div>

              {/* Ingredients */}
              <div className="mb-6">
                <h4 className="font-bold mb-3">Ingredients</h4>
                <ul className="space-y-2">
                  {(meal.ingredients || []).map((ingredient, idx) => (
                    <li key={idx} className="text-gray-700 dark:text-gray-300">
                      • <span className="font-medium">{ingredient.name}</span> - {ingredient.quantity}{ingredient.unit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              {meal.recipe_instructions && (
                <div className="mb-6">
                  <h4 className="font-bold mb-3">Instructions</h4>
                  <p className="text-gray-700 dark:text-gray-300">{meal.recipe_instructions}</p>
                </div>
              )}

              {/* Portion Guidance */}
              <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                  Portion Size: {meal.portion_size} (1 serving)
                </p>
              </div>

              {/* Nutrition Facts */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Calories</p>
                  <p className="text-xl font-bold">{meal.calories?.toFixed(0)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Protein</p>
                  <p className="text-xl font-bold text-red-600 dark:text-red-400">{meal.protein?.toFixed(1)}g</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Carbs</p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{meal.carbs?.toFixed(1)}g</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Fat</p>
                  <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{meal.fat?.toFixed(1)}g</p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Buttons */}
      <div className="mt-8 flex gap-4">
        <Button variant="primary" size="lg">
          <a href="/meal-plans">Back to Meal Plans</a>
        </Button>
        <Button variant="secondary" size="lg">
          <FileJson size={20} className="mr-2" />
          Export Plan
        </Button>
      </div>
    </div>
  )
}
