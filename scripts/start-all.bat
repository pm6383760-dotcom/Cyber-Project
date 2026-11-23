@echo off
TITLE PhishGuard AI - Launch All Services
echo ========================================================
echo   PHISHGUARD AI - LAUNCHING ALL SERVICES FOR VIVA DEMO
echo ========================================================
echo.

cd /d "%~dp0.."

echo [1/3] Starting Express Backend (Port 5000)...
start "PhishGuard Backend [Node.js:5000]" cmd /k "cd server && npm start"

echo [2/3] Starting Python ML Microservice (Port 8000)...
start "PhishGuard ML Service [FastAPI:8000]" cmd /k "cd ml_service && uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

echo [3/3] Starting React Vite Frontend (Port 5173)...
start "PhishGuard Frontend [React Vite:5173]" cmd /k "cd client && npm run dev"

echo.
echo ========================================================
echo   ALL SERVICES INITIATED!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5000
echo   ML API:   http://localhost:8000
echo ========================================================
pause
