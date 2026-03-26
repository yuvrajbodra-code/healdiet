"""AI Services for meal plan generation"""
import numpy as np
import pandas as pd
from typing import Dict, List, Tuple
import json

class MealPlanAI:
    """AI engine for personalized meal plan generation"""
    
    def __init__(self):
        """Initialize the AI engine with medical condition guidelines"""
        self.medical_guidelines = self._load_guidelines()
        self.food_database = self._load_food_database()
    
    def _load_guidelines(self) -> Dict:
        """Load medical condition nutritional guidelines"""
        return {
            "diabetes": {
                "carbs_limit": 200,
                "carbs_min": 100,
                "sugar_limit": 25,
                "fiber_min": 25,
                "glycemic_index_max": 55,
                "restricted_foods": ["white_bread", "refined_sugar", "sugary_drinks"],
                "recommended_foods": ["whole_grains", "leafy_greens", "berries"]
            },
            "ckd": {
                "sodium_limit": 2300,
                "potassium_limit": 2000,
                "phosphorus_limit": 1000,
                "protein_limit": 0.8,  # g/kg body weight
                "restricted_foods": ["high_sodium", "bananas", "oranges", "nuts"],
                "recommended_foods": ["white_rice", "apple", "cabbage", "egg_whites"]
            },
            "hypertension": {
                "sodium_limit": 2300,
                "potassium_min": 2600,
                "magnesium_min": 350,
                "restricted_foods": ["salt", "processed_foods", "cured_meats"],
                "recommended_foods": ["potassium_rich", "leafy_greens", "legumes"]
            },
            "obesity": {
                "calories_limit": 1500,
                "fat_limit": 50,
                "fiber_min": 30,
                "protein_min": 50,
                "restricted_foods": ["fried_foods", "sugary_drinks", "sweets"],
                "recommended_foods": ["vegetables", "lean_proteins", "whole_grains"]
            }
        }
    
    def _load_food_database(self) -> Dict:
        """Load comprehensive food nutrition database"""
        # This would be a more complete database in production
        return {
            "chicken_breast": {"calories": 165, "protein": 31, "carbs": 0, "fat": 3.6, "fiber": 0, "sodium": 74},
            "salmon": {"calories": 208, "protein": 20, "carbs": 0, "fat": 13, "fiber": 0, "sodium": 59},
            "brown_rice": {"calories": 112, "protein": 2.6, "carbs": 24, "fat": 0.9, "fiber": 3.5, "sodium": 7},
            "broccoli": {"calories": 34, "protein": 2.8, "carbs": 7, "fat": 0.4, "fiber": 2.4, "sodium": 64},
            "apple": {"calories": 52, "protein": 0.3, "carbs": 14, "fat": 0.2, "fiber": 2.4, "sodium": 2},
            "egg": {"calories": 155, "protein": 13, "carbs": 1.1, "fat": 11, "fiber": 0, "sodium": 124},
            "oats": {"calories": 389, "protein": 17, "carbs": 66, "fat": 7, "fiber": 10.6, "sodium": 50},
            "spinach": {"calories": 23, "protein": 2.7, "carbs": 3.6, "fat": 0.4, "fiber": 2.2, "sodium": 79},
            "sweet_potato": {"calories": 86, "protein": 1.6, "carbs": 20, "fat": 0.1, "fiber": 3, "sodium": 55},
            "greek_yogurt": {"calories": 59, "protein": 10, "carbs": 3.3, "fat": 0.4, "fiber": 0, "sodium": 75},
            "almonds": {"calories": 579, "protein": 21, "carbs": 22, "fat": 50, "fiber": 12.5, "sodium": 1},
            "lentils": {"calories": 116, "protein": 9, "carbs": 20, "fat": 0.4, "fiber": 8, "sodium": 6},
        }
    
    def generate_meal_plan(self, health_profile: Dict, duration_days: int = 7) -> Dict:
        """Generate personalized meal plan based on health profile"""
        
        # Calculate caloric and macro targets
        targets = self._calculate_targets(health_profile)
        
        # Get medical condition constraints
        conditions = health_profile.get("medical_conditions", [])
        constraints = self._get_constraints(conditions, health_profile)
        
        # Generate meals
        meals = self._generate_meals(
            duration_days=duration_days,
            targets=targets,
            constraints=constraints,
            preferences=health_profile.get("dietary_preferences", {}),
            restrictions=health_profile.get("dietary_restrictions", []),
            disliked_foods=health_profile.get("disliked_foods", [])
        )
        
        return {
            "target_nutrients": targets,
            "constraints": constraints,
            "meals": meals,
            "duration_days": duration_days,
            "ai_reasoning": {
                "medical_conditions": conditions,
                "allergies": health_profile.get("allergies", []),
                "activity_level": health_profile.get("activity_level", "moderate")
            }
        }
    
    def _calculate_targets(self, health_profile: Dict) -> Dict:
        """Calculate daily nutritional targets using Mifflin-St Jeor equation"""
        
        weight = health_profile.get("weight", 70)  # kg
        height = health_profile.get("height", 170)  # cm
        age = health_profile.get("age", 30)
        gender = health_profile.get("gender", "M")
        activity_level = health_profile.get("activity_level", "moderate")
        
        # Mifflin-St Jeor BMR calculation
        if gender.lower() in ["m", "male"]:
            bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5
        else:
            bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161
        
        # Activity factor
        activity_factors = {"sedentary": 1.2, "light": 1.375, "moderate": 1.55, "active": 1.725}
        tdee = bmr * activity_factors.get(activity_level.lower(), 1.55)
        
        bmi = weight / ((height / 100) ** 2)
        if bmi >= 30:  # Obesity
            tdee *= 0.85  # 15% calorie deficit
        
        # Macronutrient distribution
        protein = weight * 1.6  # 1.6g per kg
        fat = (tdee * 0.30) / 9  # 30% of calories
        carbs = (tdee * 0.40) / 4  # 40% of calories
        fiber = 25  # Standard recommendation
        
        return {
            "calories": round(tdee),
            "protein_g": round(protein, 1),
            "carbs_g": round(carbs, 1),
            "fat_g": round(fat, 1),
            "fiber_g": round(fiber, 1)
        }
    
    def _get_constraints(self, conditions: List[str], health_profile: Dict) -> Dict:
        """Get nutritional constraints based on medical conditions"""
        constraints = {
            "sodium_limit": 2300,
            "potassium_limit": 3500,
            "phosphorus_limit": 1200,
        }
        
        for condition in conditions:
            if condition in self.medical_guidelines:
                constraints.update(self.medical_guidelines[condition])
        
        return constraints
    
    def _generate_meals(self, duration_days: int, targets: Dict, constraints: Dict, 
                       preferences: Dict, restrictions: List[str], disliked_foods: List[str]) -> List[Dict]:
        """Generate daily meals"""
        meals = []
        meal_types = ["breakfast", "lunch", "dinner", "snack"]
        
        for day in range(1, duration_days + 1):
            daily_meals = self._generate_daily_meals(
                day=day,
                targets=targets,
                constraints=constraints,
                preferences=preferences,
                restrictions=restrictions,
                disliked_foods=disliked_foods
            )
            meals.extend(daily_meals)
        
        return meals
    
    def _generate_daily_meals(self, day: int, targets: Dict, constraints: Dict,
                             preferences: Dict, restrictions: List[str], disliked_foods: List[str]) -> List[Dict]:
        """Generate meals for a single day"""
        # Simple implementation - can be enhanced with more sophisticated algorithms
        
        meals = [
            {
                "day": day,
                "type": "breakfast",
                "meal_name": "Oatmeal Bowl with Berries",
                "ingredients": [
                    {"name": "oats", "quantity": 40, "unit": "g"},
                    {"name": "milk", "quantity": 200, "unit": "ml"},
                    {"name": "blueberries", "quantity": 80, "unit": "g"}
                ],
                "calories": 250,
                "protein": 8,
                "carbs": 45,
                "fat": 4,
                "fiber": 7,
                "instructions": "Mix oats with milk, microwave for 2 minutes, top with berries"
            },
            {
                "day": day,
                "type": "lunch",
                "meal_name": "Grilled Chicken Salad",
                "ingredients": [
                    {"name": "chicken_breast", "quantity": 150, "unit": "g"},
                    {"name": "spinach", "quantity": 100, "unit": "g"},
                    {"name": "olive_oil", "quantity": 10, "unit": "ml"}
                ],
                "calories": 280,
                "protein": 35,
                "carbs": 5,
                "fat": 12,
                "fiber": 2,
                "instructions": "Grill chicken, serve over fresh spinach with oil and lemon dressing"
            },
            {
                "day": day,
                "type": "dinner",
                "meal_name": "Salmon with Brown Rice and Broccoli",
                "ingredients": [
                    {"name": "salmon", "quantity": 150, "unit": "g"},
                    {"name": "brown_rice", "quantity": 100, "unit": "g"},
                    {"name": "broccoli", "quantity": 150, "unit": "g"}
                ],
                "calories": 450,
                "protein": 35,
                "carbs": 40,
                "fat": 15,
                "fiber": 4,
                "instructions": "Bake salmon at 180C for 15 mins, boil rice, steam broccoli"
            },
            {
                "day": day,
                "type": "snack",
                "meal_name": "Greek Yogurt with Almonds",
                "ingredients": [
                    {"name": "greek_yogurt", "quantity": 150, "unit": "g"},
                    {"name": "almonds", "quantity": 25, "unit": "g"}
                ],
                "calories": 200,
                "protein": 15,
                "carbs": 15,
                "fat": 8,
                "fiber": 3,
                "instructions": "Serve yogurt topped with almonds"
            }
        ]
        
        return meals
