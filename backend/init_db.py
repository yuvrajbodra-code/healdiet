"""
Healdiet - AI Personalized Diet Platform
Database initialization and management
"""

from app.database.database import engine, Base, SessionLocal
from app.models import user, health_profile, meal_plan, medical_condition

def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

def seed_medical_conditions():
    """Seed medical conditions reference data"""
    db = SessionLocal()
    try:
        from app.models.medical_condition import MedicalCondition
        
        conditions = [
            {
                "name": "diabetes",
                "description": "Chronic condition affecting blood sugar regulation",
                "restricted_foods": ["white bread", "refined sugar", "sugary drinks", "white rice"],
                "recommended_foods": ["whole grains", "leafy greens", "berries", "nuts"],
                "nutrient_guidelines": {
                    "carbs_limit": 200,
                    "fiber_min": 25,
                    "sugar_limit": 25,
                    "glycemic_index_max": 55
                },
                "key_considerations": [
                    "Monitor carbohydrate intake",
                    "Choose low glycemic index foods",
                    "Include fiber-rich foods",
                    "Manage portion sizes"
                ]
            },
            {
                "name": "ckd",
                "description": "Chronic Kidney Disease - progressive kidney function loss",
                "restricted_foods": ["high sodium", "bananas", "oranges", "nuts", "red meat"],
                "recommended_foods": ["white rice", "apple", "cabbage", "egg whites", "lean fish"],
                "nutrient_guidelines": {
                    "sodium_limit": 2300,
                    "potassium_limit": 2000,
                    "phosphorus_limit": 1000,
                    "protein_limit": 0.8
                },
                "key_considerations": [
                    "Restrict sodium and potassium",
                    "Manage protein intake",
                    "Monitor phosphorus",
                    "Stay hydrated appropriately"
                ]
            },
            {
                "name": "hypertension",
                "description": "High blood pressure - cardiovascular risk factor",
                "restricted_foods": ["salt", "processed foods", "cured meats", "fried foods"],
                "recommended_foods": ["potassium rich", "leafy greens", "legumes", "oats", "berries"],
                "nutrient_guidelines": {
                    "sodium_limit": 2300,
                    "potassium_min": 2600,
                    "magnesium_min": 350
                },
                "key_considerations": [
                    "Reduce sodium intake",
                    "Increase potassium-rich foods",
                    "Maintain healthy weight",
                    "Exercise regularly"
                ]
            },
            {
                "name": "obesity",
                "description": "Excess body weight - increased health risks",
                "restricted_foods": ["fried foods", "sugary drinks", "sweets", "high-fat foods"],
                "recommended_foods": ["vegetables", "lean proteins", "whole grains", "fruits"],
                "nutrient_guidelines": {
                    "calories_limit": 1500,
                    "fat_limit": 50,
                    "fiber_min": 30,
                    "protein_min": 50
                },
                "key_considerations": [
                    "Create calorie deficit",
                    "Increase fiber intake",
                    "Monitor portion sizes",
                    "Stay physically active"
                ]
            }
        ]
        
        for cond_data in conditions:
            existing = db.query(MedicalCondition).filter(
                MedicalCondition.name == cond_data["name"]
            ).first()
            if not existing:
                condition = MedicalCondition(**cond_data)
                db.add(condition)
        
        db.commit()
        print("Medical conditions seeded successfully!")
    except Exception as e:
        print(f"Error seeding medical conditions: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
    seed_medical_conditions()
    print("Database initialization complete!")
