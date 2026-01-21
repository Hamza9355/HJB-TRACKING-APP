@echo off
echo.
echo ====================================
echo HJB Tracking System - Start Script
echo ====================================
echo.
echo Starting Backend (Port 5000)...
start cmd /k "cd backend && npm start"
timeout /t 3
echo.
echo Starting Frontend (Port 3000)...
start cmd /k "cd frontend && npm start"
echo.
echo ====================================
echo Both services should now be running:
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
echo ====================================
echo.
pause
