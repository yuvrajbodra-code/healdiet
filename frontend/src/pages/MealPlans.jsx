import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import { mealPlanAPI } from '../services/api'
import toast from 'react-hot-toast'
import { Plus, Trash2, ChevronRight, Calendar, Utensils } from 'lucide-react'

export default function MealPlans() {
  const [mealPlans, setMealPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [generatingPlan, setGeneratingPlan] = useState(false)
  const [showGenerateForm, setShowGenerateForm] = useState(false)
  const [planForm, setPlanForm] = useState({
    plan_name: '',
    plan_description: '',
    duration_days: 7
  })

  useEffect(() => {
    loadMealPlans()
  }, [])

  const loadMealPlans = async () => {
    try {
      const response = await mealPlanAPI.getAll()
      setMealPlans(response.data)
    } catch (error) {
      toast.error('Failed to load meal plans')
    } finally {
      setLoading(false)
    }
  }

  const handleGeneratePlan = async (e) => {
    e.preventDefault()
    
    if (!planForm.plan_name) {
      toast.error('Please enter a plan name')
      return
    }

    setGeneratingPlan(true)
    try {
      const response = await mealPlanAPI.generate(
        planForm.plan_name,
        planForm.plan_description,
        parseInt(planForm.duration_days)
      )
      toast.success('Meal plan generated successfully!')
      setMealPlans([...mealPlans, response.data])
      setPlanForm({ plan_name: '', plan_description: '', duration_days: 7 })
      setShowGenerateForm(false)
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to generate meal plan')
    } finally {
      setGeneratingPlan(false)
    }
  }

  const handleDeletePlan = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this meal plan?')) return

    try {
      await mealPlanAPI.delete(planId)
      setMealPlans(mealPlans.filter(plan => plan.id !== planId))
      toast.success('Meal plan deleted')
    } catch (error) {
      toast.error('Failed to delete meal plan')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-8">Loading meal plans...</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Meal Plans</h1>
        <Button variant="primary" size="lg" onClick={() => setShowGenerateForm(!showGenerateForm)}>
          <Plus size={20} className="mr-2" />
          Generate New Plan
        </Button>
      </div>

      {/* Generate Form */}
      {showGenerateForm && (
        <Card className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Create New Meal Plan</h2>
          <form onSubmit={handleGeneratePlan} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Plan Name *</label>
              <input
                type="text"
                value={planForm.plan_name}
                onChange={(e) => setPlanForm(prev => ({ ...prev, plan_name: e.target.value }))}
                placeholder="e.g., Weekly Diabetic Meal Plan"
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={planForm.plan_description}
                onChange={(e) => setPlanForm(prev => ({ ...prev, plan_description: e.target.value }))}
                placeholder="Optional description for your meal plan"
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Duration (Days)</label>
              <select
                value={planForm.duration_days}
                onChange={(e) => setPlanForm(prev => ({ ...prev, duration_days: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              >
                <option value="7">7 Days</option>
                <option value="14">14 Days</option>
                <option value="30">30 Days</option>
              </select>
            </div>

            <div className="flex gap-4">
              <Button type="submit" variant="primary" disabled={generatingPlan}>
                {generatingPlan ? 'Generating...' : 'Generate Plan'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => setShowGenerateForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Meal Plans List */}
      {mealPlans.length === 0 ? (
        <Card className="text-center">
          <Utensils size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">No meal plans yet. Generate your first plan!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mealPlans.map(plan => (
            <Card key={plan.id}>
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2">{plan.plan_name}</h3>
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-2">
                  <Calendar size={16} className="mr-2" />
                  {plan.duration_days} days
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <Utensils size={16} className="mr-2" />
                  {plan.meals?.length || 0} meals
                </div>
              </div>

              {/* Nutrition Summary */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4 text-sm">
                <p className="font-semibold mb-2">Daily Average</p>
                <div className="space-y-1">
                  <p>Calories: <span className="font-bold">{(plan.total_calories / plan.duration_days).toFixed(0)}</span> kcal</p>
                  <p>Protein: <span className="font-bold">{(plan.total_protein / plan.duration_days).toFixed(1)}</span>g</p>
                  <p>Carbs: <span className="font-bold">{(plan.total_carbs / plan.duration_days).toFixed(1)}</span>g</p>
                  <p>Fat: <span className="font-bold">{(plan.total_fat / plan.duration_days).toFixed(1)}</span>g</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link to={`/meal-plans/${plan.id}`} className="flex-1">
                  <Button variant="primary" size="md" className="w-full">
                    View Details <ChevronRight size={16} />
                  </Button>
                </Link>
                <button
                  onClick={() => handleDeletePlan(plan.id)}
                  className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
                  title="Delete plan"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
