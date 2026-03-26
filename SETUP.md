# Installation & Setup Guide

## Quick Start

### Option 1: Automated Startup (Windows)
```bash
start.bat
```

### Option 2: Manual Startup

#### Backend Setup
```bash
cd backend
python main.py
```

Backend runs on: `http://localhost:8000`
API Documentation: `http://localhost:8000/docs`

#### Frontend Setup (in a new terminal)
```bash
cd frontend
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## Detailed Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create environment file** (if not exists)
```bash
copy .env.example .env
```

3. **Install Python dependencies** (already done)
```bash
pip install -r requirements.txt
```

4. **Initialize database** (already done)
```bash
python init_db.py
```

5. **Start the server**
```bash
python main.py
```

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install npm dependencies** (already done)
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Build for production**
```bash
npm run build
```

---

## API Documentation

Once backend is running, visit: `http://localhost:8000/docs`

### Key Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token

#### Health Profile
- `POST /health-profile/create` - Create health profile
- `GET /health-profile/` - Get user's profile
- `PUT /health-profile/` - Update profile

#### Meal Plans
- `POST /meal-plans/generate` - Generate AI meal plan
- `GET /meal-plans/` - Get all user's meal plans
- `GET /meal-plans/{plan_id}` - Get specific meal plan
- `DELETE /meal-plans/{plan_id}` - Delete meal plan

---

## Configuration

Edit `.env` file in backend directory to change:
- `DATABASE_URL` - Database connection string
- `SECRET_KEY` - JWT secret key
- `ENVIRONMENT` - development/production
- `CORS_ORIGINS` - Allowed frontend URLs

---

## Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
# Find and kill process using port 8000
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :8000
kill -9 <PID>
```

**Import errors:**
Ensure all dependencies are installed:
```bash
pip install -r requirements.txt
```

### Frontend Issues

**npm install fails:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Port 5173 already in use:**
The development server will use next available port automatically

---

## File Structure

```
healdiet/
├── backend/
│   ├── app/
│   │   ├── models/          # SQLAlchemy models
│   │   ├── routes/          # FastAPI routes
│   │   ├── services/        # Business logic & auth
│   │   ├── ai/              # AI meal plan engine
│   │   ├── database/        # Database config
│   │   ├── schemas.py       # Pydantic schemas
│   │   └── config.py        # Configuration
│   ├── main.py              # FastAPI entry point
│   ├── init_db.py           # Database initialization
│   └── requirements.txt      # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API client
│   │   ├── store/           # State management
│   │   ├── utils/           # Utilities
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # React entry point
│   ├── index.html           # HTML template
│   ├── package.json         # npm dependencies
│   ├── vite.config.js       # Vite configuration
│   └── tailwind.config.js   # Tailwind configuration
├── README.md                # Main documentation
├── start.bat                # Windows startup script
├── start.sh                 # Unix startup script
└── .github/
    └── copilot-instructions.md
```

---

## Development Workflow

1. **Backend Development**
   - Edit files in `backend/app/`
   - Server auto-reloads changes (with uvicorn)
   - Check API docs on `http://localhost:8000/docs`

2. **Frontend Development**
   - Edit files in `frontend/src/`
   - Hot module replacement enabled
   - Changes reflect immediately in browser

3. **Database Changes**
   - Edit models in `backend/app/models/`
   - Run `python init_db.py` to create new tables
   - Or manually migrate if needed

---

## Testing

### Backend Testing Example

Using curl or Postman:

```bash
# Register user
POST http://localhost:8000/auth/register
{
  "email": "user@example.com",
  "username": "testuser",
  "password": "password123",
  "full_name": "Test User"
}

# Login
POST http://localhost:8000/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

---

## Deployment

### Backend Deployment

For production, use:
```bash
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker
```

### Frontend Deployment

Build and deploy static files:
```bash
npm run build
# Deploy 'dist' folder to any static hosting
```

---

## Support & Issues

- Check logs in terminal for errors
- Ensure ports 8000 and 5173 are available
- Verify all dependencies are installed
- Clear browser cache if UI issues occur
