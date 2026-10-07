@echo off
echo ========================================================
echo Credit Card Fraud Analysis & Detection System
echo Starting FastAPI Backend and Vite Frontend...
echo ========================================================

start "Fraud Detection API (FastAPI)" cmd /k "python server.py"
start "Fraud Analytics Dashboard (Vite React)" cmd /k "npm run dev"

echo.
echo Application started!
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo ========================================================
