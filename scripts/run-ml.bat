@echo off
TITLE PhishGuard ML Microservice
cd /d "%~dp0..\ml_service"
echo Starting PhishGuard Python FastAPI ML Service on http://127.0.0.1:8000...
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
pause
