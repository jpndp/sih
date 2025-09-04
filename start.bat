@echo off
echo Starting KMRL Document Intelligence System...
echo.

echo Starting Backend Server...
start cmd /k "cd /d %~dp0backend && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo Both servers are starting up...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit...
pause > nul
