@echo off
REM Healdiet Startup Script for Windows

echo Starting Healdiet - AI Personalized Diet Platform
echo ==================================================

REM Start Backend
echo.
echo Starting backend server on port 8000...
echo To stop the server, press Ctrl+C
echo.

start cmd /k "cd backend && c:/python314/python.exe main.py"

REM Wait a bit for backend to start
timeout /t 3 /nobreak

REM Start Frontend
echo.
echo Starting frontend development server on port 5173...
echo To stop all servers, close these windows
echo.

start cmd /k "cd frontend && npm run dev"

echo.
echo ==================================================
echo Healdiet is running!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/docs
echo ==================================================
echo.
