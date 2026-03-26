from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base

class MealPlan(Base):
    """Meal plan model"""
    __tablename__ = "meal_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    plan_name = Column(String)
    plan_description = Column(Text, nullable=True)
    duration_days = Column(Integer, default=7)  # 7-day, 14-day, 30-day plans
    
    # Meal plan details
    meals = relationship("MealItem", back_populates="meal_plan", cascade="all, delete-orphan")
    
    # Nutrition summary
    total_calories = Column(Float)
    total_protein = Column(Float)
    total_carbs = Column(Float)
    total_fat = Column(Float)
    total_fiber = Column(Float)
    total_sodium = Column(Float, nullable=True)
    
    # Metadata
    ai_generated = Column(JSON, default=dict)  # Store AI reasoning/parameters
    is_active = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="meal_plans")

class MealItem(Base):
    """Individual meal items in a meal plan"""
    __tablename__ = "meal_items"

    id = Column(Integer, primary_key=True, index=True)
    meal_plan_id = Column(Integer, ForeignKey("meal_plans.id"), index=True)
    
    # Meal details
    day_number = Column(Integer)  # 1-7 or 1-30
    meal_type = Column(String)  # breakfast, lunch, dinner, snack
    meal_name = Column(String)
    description = Column(Text, nullable=True)
    
    # Ingredients
    ingredients = Column(JSON, default=list)  # [{"name": "food", "quantity": "1 cup", "unit": "g"}]
    recipe_instructions = Column(Text, nullable=True)
    
    # Nutrition information
    calories = Column(Float)
    protein = Column(Float)  # grams
    carbs = Column(Float)  # grams
    fat = Column(Float)  # grams
    fiber = Column(Float)  # grams
    sodium = Column(Float, nullable=True)  # mg
    potassium = Column(Float, nullable=True)  # mg
    phosphorus = Column(Float, nullable=True)  # mg
    sugar = Column(Float, nullable=True)  # grams
    
    # Portion guidance
    portion_size = Column(String)  # "1 cup", "100g", etc.
    serving_size = Column(Integer, default=1)
    
    # Metadata
    is_vegetarian = Column(Integer, default=0)
    is_vegan = Column(Integer, default=0)
    is_gluten_free = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    meal_plan = relationship("MealPlan", back_populates="meals")
