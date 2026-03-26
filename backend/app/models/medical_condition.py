from sqlalchemy import Column, Integer, String, Text, JSON
from app.database.database import Base

class MedicalCondition(Base):
    """Medical condition reference data"""
    __tablename__ = "medical_conditions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text)
    
    # Dietary guidelines for this condition
    restricted_foods = Column(JSON, default=list)  # Foods to avoid
    recommended_foods = Column(JSON, default=list)  # Foods to include
    
    # Nutrient constraints
    nutrient_guidelines = Column(JSON, default=dict)
    # Example: {
    #     "diabetes": {"carbs_limit": 45, "fiber_min": 25, "sugar_limit": 25},
    #     "ckd": {"sodium_limit": 2300, "potassium_limit": 2000, "phosphorus_limit": 1000},
    #     "hypertension": {"sodium_limit": 2300, "potassium_min": 2600},
    #     "obesity": {"calories_limit": 1500, "fat_limit": 50}
    # }
    
    key_considerations = Column(JSON, default=list)
