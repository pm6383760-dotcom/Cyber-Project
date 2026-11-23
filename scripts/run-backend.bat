@echo off
TITLE PhishGuard Backend
cd /d "%~dp0..\server"
echo Starting PhishGuard Backend on http://localhost:5000...
npm start
pause
