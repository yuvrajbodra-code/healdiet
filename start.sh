#!/bin/bash
# Healdiet Startup Script

echo "Starting Healdiet - AI Personalized Diet Platform"
echo "=================================================="

# Start Backend
echo ""
echo "Starting backend server on port 8000..."
echo "To stop the server, press Ctrl+C"
echo ""

cd backend
python main.py &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start Frontend
echo ""
echo "Starting frontend development server on port 5173..."
echo "To stop the server, press Ctrl+C"
echo ""

cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Handle cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT

echo ""
echo "=================================================="
echo "Healdiet is running!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo "API Docs: http://localhost:8000/docs"
echo "=================================================="

wait
