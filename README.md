# Healdiet - AI Personalized Diet Platform

An intelligent, AI-powered diet recommendation system tailored for patients with specific medical conditions like diabetes, chronic kidney disease (CKD), hypertension, and obesity.

## Features

- **Personalized Nutrition Plans**: AI-generated meal plans based on individual health conditions and preferences
- **Medical Condition Support**: Specialized recommendations for diabetes, CKD, hypertension, and obesity
- **Comprehensive Health Tracking**: Monitor vital health metrics and dietary adherence
- **Interactive Dashboard**: Beautiful UI with charts, progress tracking, and nutrition insights
- **Dark/Light Mode**: User-friendly interface with theme switching
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Project Structure

```
healdiet/
├── backend/              # Python FastAPI backend
│   ├── app/
│   │   ├── models/      # Database models
│   │   ├── routes/      # API endpoints
│   │   ├── services/    # Business logic
│   │   ├── ai/          # AI meal plan engine
│   │   ├── database/    # Database configuration
│   │   ├── schemas.py   # Pydantic schemas
│   │   └── config.py    # App configuration
│   ├── main.py          # FastAPI application
│   └── requirements.txt  # Python dependencies
└── frontend/            # React frontend
    ├── src/
    │   ├── components/  # React components
    │   ├── pages/       # Page components
    │   ├── services/    # API services
    │   ├── hooks/       # Custom React hooks
    │   └── utils/       # Utilities
    ├── public/          # Static assets
    └── package.json     # Node dependencies
```

## Backend Setup

### Prerequisites
- Python 3.8+
- pip or conda

### Installation

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
```

### Running the Backend

```bash
python main.py
```

The API will be available at `http://localhost:8000`
API Documentation: `http://localhost:8000/docs`

## Frontend Setup

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Running the Frontend

```bash
npm run dev
```

The application will be available at `http://localhost:3000` or `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get access token

### Health Profile
- `POST /health-profile/create` - Create/update health profile
- `GET /health-profile/` - Get user's health profile
- `PUT /health-profile/` - Update health profile

### Meal Plans
- `POST /meal-plans/generate` - Generate AI meal plan
- `GET /meal-plans/` - Get all meal plans
- `GET /meal-plans/{plan_id}` - Get specific meal plan
- `DELETE /meal-plans/{plan_id}` - Delete meal plan

## Technology Stack

### Backend
- **Framework**: FastAPI
- **Database**: SQLAlchemy + SQLite
- **Authentication**: JWT
- **AI/ML**: scikit-learn, pandas, numpy
- **Async**: Uvicorn

### Frontend
- **Framework**: React 18+
- **Styling**: Tailwind CSS / Material-UI
- **Charts**: Plotly / Chart.js
- **State Management**: Context API / Redux
- **HTTP Client**: Axios

## Medical Conditions Supported

### Diabetes
- Custom carbohydrate limits based on glycemic index
- Fiber and sugar monitoring
- Blood sugar-friendly meal recommendations

### Chronic Kidney Disease (CKD)
- Sodium, potassium, and phosphorus restrictions
- Protein intake management
- Renal-friendly food suggestions

### Hypertension
- Sodium restriction (<2300mg/day)
- Potassium-rich food recommendations
- Heart-healthy meal plans

### Obesity
- Calorie-controlled meal plans
- High-protein, high-fiber recommendations
- Portion guidance and weight management support

## Configuration

Edit `.env` file to configure:
```
DATABASE_URL=sqlite:///./healdiet.db
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=development
DEBUG=True
```

## Future Enhancements

- [ ] Integration with wearable devices for real-time health data
- [ ] Machine learning model optimization for better recommendations
- [ ] Grocery shopping list generation
- [ ] Video tutorials for meal preparation
- [ ] Community forums and peer support
- [ ] Integration with fitness trackers
- [ ] Mobile app (React Native)
- [ ] Multi-language support

## License

MIT License - see LICENSE file for details

## Support

For issues or questions, please create an issue in the repository.
