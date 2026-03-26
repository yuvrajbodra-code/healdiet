"""Health profile routes"""
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.user import User
from app.models.health_profile import HealthProfile
from app.schemas import HealthProfileCreate, HealthProfileResponse, HealthProfileUpdate
from app.services.auth import decode_token
from typing import Optional

router = APIRouter(prefix="/health-profile", tags=["health-profile"])

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

@router.post("/create", response_model=HealthProfileResponse)
def create_health_profile(
    profile: HealthProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create or update user health profile"""
    # Check if profile already exists
    db_profile = db.query(HealthProfile).filter(HealthProfile.user_id == current_user.id).first()
    
    # Calculate BMI
    bmi = profile.weight / ((profile.height / 100) ** 2)
    
    # Calculate caloric needs (Mifflin-St Jeor)
    if profile.gender.lower() in ["m", "male"]:
        bmr = (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) + 5
    else:
        bmr = (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) - 161
    
    activity_factors = {"sedentary": 1.2, "light": 1.375, "moderate": 1.55, "active": 1.725}
    tdee = bmr * activity_factors.get(profile.activity_level.lower(), 1.55)
    
    if profile.gender.lower() in ["m", "male"]:
        bmr = (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) + 5
    else:
        bmr = (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) - 161
    
    activity_factors = {"sedentary": 1.2, "light": 1.375, "moderate": 1.55, "active": 1.725}
    tdee = bmr * activity_factors.get(profile.activity_level.lower(), 1.55)
    
    target_protein = profile.weight * 1.6
    target_fat = (tdee * 0.30) / 9
    target_carbs = (tdee * 0.40) / 4
    target_fiber = 25
    
    if db_profile:
        # Update existing
        for key, value in profile.dict(exclude_unset=True).items():
            setattr(db_profile, key, value)
        db_profile.bmi = bmi
        db_profile.target_calories = tdee
        db_profile.target_protein = target_protein
        db_profile.target_fat = target_fat
        db_profile.target_carbs = target_carbs
        db_profile.target_fiber = target_fiber
    else:
        # Create new
        db_profile = HealthProfile(
            user_id=current_user.id,
            bmi=bmi,
            target_calories=tdee,
            target_protein=target_protein,
            target_fat=target_fat,
            target_carbs=target_carbs,
            target_fiber=target_fiber,
            **profile.dict()
        )
        db.add(db_profile)
    
    db.commit()
    db.refresh(db_profile)
    return db_profile

@router.get("/", response_model=HealthProfileResponse)
def get_health_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user health profile"""
    profile = db.query(HealthProfile).filter(HealthProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Health profile not found")
    return profile

@router.put("/", response_model=HealthProfileResponse)
def update_health_profile(
    profile_update: HealthProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update health profile"""
    profile = db.query(HealthProfile).filter(HealthProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Health profile not found")
    
    update_data = profile_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(profile, key, value)
    
    # Recalculate BMI and targets if weight/height changed
    if "weight" in update_data or "height" in update_data:
        weight = update_data.get("weight", profile.weight)
        height = update_data.get("height", profile.height)
        profile.bmi = weight / ((height / 100) ** 2)
    
    db.commit()
    db.refresh(profile)
    return profile
