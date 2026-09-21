@echo off
setlocal

set "ROOT=%~dp0"
set "BACKEND=%ROOT%backend"
set "FRONTEND=%ROOT%frontend"
set "PYTHON=%ROOT%.venv\Scripts\python.exe"

if not exist "%FRONTEND%\package.json" (
    echo Frontend project not found: "%FRONTEND%"
    pause
    exit /b 1
)

if not exist "%BACKEND%\main.py" (
    echo Backend entry point not found: "%BACKEND%\main.py"
    pause
    exit /b 1
)

if exist "%PYTHON%" (
    start "Voice Backend - http://localhost:8000" /D "%BACKEND%" cmd /k ""%PYTHON%" -m uvicorn main:app --app-dir %BACKEND% --reload --host 0.0.0.0 --port 8000"
) else (
    start "Voice Backend - http://localhost:8000" /D "%BACKEND%" cmd /k "py -3 -m uvicorn main:app --app-dir %BACKEND% --reload --host 0.0.0.0 --port 8000"
)

start "Voice Frontend - http://localhost:5173" /D "%FRONTEND%" cmd /k "npm run dev -- --host 0.0.0.0"

timeout /t 2 /nobreak >nul

echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8000
echo Close the Backend and Frontend windows to stop the services.
endlocal
