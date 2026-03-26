"""Route models (Pydantic schemas)"""
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Health Profile Schemas
class HealthProfileCreate(BaseModel):
    age: int
    gender: str
    height: float  # cm
    weight: float  # kg
    medical_conditions: List[str]
    allergies: Optional[str] = None
    dietary_restrictions: List[str] = []
    activity_level: str
    cuisine_preferences: Optional[List[str]] = None
    disliked_foods: Optional[List[str]] = None
    meal_frequency: int = 3

class HealthProfileUpdate(BaseModel):
    age: Optional[int] = None
    weight: Optional[float] = None
    medical_conditions: Optional[List[str]] = None
    allergies: Optional[str] = None
    dietary_restrictions: Optional[List[str]] = None
    activity_level: Optional[str] = None
    cuisine_preferences: Optional[List[str]] = None
    disliked_foods: Optional[List[str]] = None

class HealthProfileResponse(HealthProfileCreate):
    id: int
    user_id: int
    bmi: Optional[float]
    target_calories: Optional[float]
    created_at: datetime
    
    class Config:
        from_attributes = True

# Meal Plan Schemas
class MealItemCreate(BaseModel):
    day_number: int
    meal_type: str  # breakfast, lunch, dinner, snack
    meal_name: str
    description: Optional[str] = None
    ingredients: List[dict]
    recipe_instructions: Optional[str] = None
    calories: float
    protein: float
    carbs: float
    fat: float
    fiber: float
    sodium: Optional[float] = None
    portion_size: str

class MealItemResponse(MealItemCreate):
    id: int
    meal_plan_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class MealPlanCreate(BaseModel):
    plan_name: str
    plan_description: Optional[str] = None
    duration_days: int = 7

class MealPlanResponse(BaseModel):
    id: int
    user_id: int
    plan_name: str
    duration_days: int
    total_calories: float
    total_protein: float
    total_carbs: float
    total_fat: float
    meals: List[MealItemResponse]
    created_at: datetime
    
    class Config:
        from_attributes = True

# Auth Schemas
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
