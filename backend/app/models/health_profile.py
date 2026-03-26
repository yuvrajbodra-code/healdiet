from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base

class HealthProfile(Base):
    """User health profile model"""
    __tablename__ = "health_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, index=True)
    age = Column(Integer)
    gender = Column(String)  # Male, Female, Other
    height = Column(Float)  # in cm
    weight = Column(Float)  # in kg
    bmi = Column(Float)
    
    # Medical conditions (comma-separated or JSON)
    medical_conditions = Column(JSON, default=list)  # ["diabetes", "ckd", "hypertension"]
    allergies = Column(String)  # comma-separated
    dietary_restrictions = Column(JSON, default=list)  # ["vegetarian", "gluten-free"]
    
    # Health metrics
    activity_level = Column(String)  # sedentary, light, moderate, active
    target_calories = Column(Float)
    target_protein = Column(Float)
    target_carbs = Column(Float)
    target_fat = Column(Float)
    target_fiber = Column(Float)
    target_sodium = Column(Float, nullable=True)  # For hypertension
    target_potassium = Column(Float, nullable=True)  # For CKD
    target_phosphorus = Column(Float, nullable=True)  # For CKD
    
    # Preferences
    cuisine_preferences = Column(JSON, default=list)
    disliked_foods = Column(JSON, default=list)
    meal_frequency = Column(Integer, default=3)  # meals per day
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="health_profile")
