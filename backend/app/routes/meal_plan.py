"""Meal plan routes"""
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import Optional
from app.database.database import get_db
from app.models.user import User
from app.models.meal_plan import MealPlan, MealItem
from app.models.health_profile import HealthProfile
from app.schemas import MealPlanCreate, MealPlanResponse, MealItemResponse
from app.services.auth import decode_token
from app.ai.meal_plan_engine import MealPlanAI

router = APIRouter(prefix="/meal-plans", tags=["meal-plans"])

def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)) -> User:
    """Get current user from token"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token")
    
    token = authorization.replace("Bearer ", "")
    token_data = decode_token(token)
    if not token_data:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(User).filter(User.email == token_data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user
    """Get current user from token"""
    token_data = decode_token(credentials.credentials)
    if not token_data:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(User).filter(User.email == token_data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

@router.post("/generate", response_model=MealPlanResponse)
def generate_meal_plan(
    plan_request: MealPlanCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate AI-powered meal plan for user"""
    
    # Get user's health profile
    health_profile = db.query(HealthProfile).filter(HealthProfile.user_id == current_user.id).first()
    if not health_profile:
        raise HTTPException(status_code=404, detail="Health profile not found. Please complete health profile setup first.")
    
    # Generate meal plan using AI
    ai_engine = MealPlanAI()
    
    health_data = {
        "age": health_profile.age,
        "gender": health_profile.gender,
        "height": health_profile.height,
        "weight": health_profile.weight,
        "medical_conditions": health_profile.medical_conditions or [],
        "activity_level": health_profile.activity_level,
        "allergies": health_profile.allergies,
        "dietary_restrictions": health_profile.dietary_restrictions or [],
        "disliked_foods": health_profile.disliked_foods or [],
        "dietary_preferences": {"cuisines": health_profile.cuisine_preferences or []}
    }
    
    ai_plan = ai_engine.generate_meal_plan(health_data, plan_request.duration_days)
    
    # Create meal plan in database
    total_calories = 0
    total_protein = 0
    total_carbs = 0
    total_fat = 0
    total_fiber = 0
    
    db_meal_plan = MealPlan(
        user_id=current_user.id,
        plan_name=plan_request.plan_name,
        plan_description=plan_request.plan_description,
        duration_days=plan_request.duration_days,
        ai_generated=ai_plan.get("ai_reasoning", {})
    )
    
    # Create meal items
    for meal_data in ai_plan.get("meals", []):
        meal_item = MealItem(
            day_number=meal_data.get("day"),
            meal_type=meal_data.get("type"),
            meal_name=meal_data.get("meal_name"),
            description=meal_data.get("meal_name"),
            ingredients=meal_data.get("ingredients", []),
            recipe_instructions=meal_data.get("instructions"),
            calories=meal_data.get("calories", 0),
            protein=meal_data.get("protein", 0),
            carbs=meal_data.get("carbs", 0),
            fat=meal_data.get("fat", 0),
            fiber=meal_data.get("fiber", 0),
            portion_size="standard"
        )
        
        total_calories += meal_item.calories
        total_protein += meal_item.protein
        total_carbs += meal_item.carbs
        total_fat += meal_item.fat
        total_fiber += meal_item.fiber
        
        db_meal_plan.meals.append(meal_item)
    
    db_meal_plan.total_calories = total_calories
    db_meal_plan.total_protein = total_protein
    db_meal_plan.total_carbs = total_carbs
    db_meal_plan.total_fat = total_fat
    
    db.add(db_meal_plan)
    db.commit()
    db.refresh(db_meal_plan)
    
    return db_meal_plan

@router.get("/", response_model=list[MealPlanResponse])
def get_user_meal_plans(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all meal plans for current user"""
    meal_plans = db.query(MealPlan).filter(MealPlan.user_id == current_user.id).all()
    return meal_plans

@router.get("/{plan_id}", response_model=MealPlanResponse)
def get_meal_plan(
    plan_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get specific meal plan"""
    meal_plan = db.query(MealPlan).filter(
        MealPlan.id == plan_id,
        MealPlan.user_id == current_user.id
    ).first()
    
    if not meal_plan:
        raise HTTPException(status_code=404, detail="Meal plan not found")
    
    return meal_plan

@router.delete("/{plan_id}")
def delete_meal_plan(
    plan_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete meal plan"""
    meal_plan = db.query(MealPlan).filter(
        MealPlan.id == plan_id,
        MealPlan.user_id == current_user.id
    ).first()
    
    if not meal_plan:
        raise HTTPException(status_code=404, detail="Meal plan not found")
    
    db.delete(meal_plan)
    db.commit()
    
    return {"message": "Meal plan deleted successfully"}
