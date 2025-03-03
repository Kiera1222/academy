@echo off
echo Setting up Wild Riders game...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Please install Node.js to run this game.
    echo Visit https://nodejs.org/ to download and install Node.js.
    pause
    exit /b 1
)

REM Run setup script
echo Running setup script...
node setup.js

REM Install dependencies
echo Installing dependencies...
call npm install

REM Start the server
echo Starting the game server...
echo Open your browser and go to http://localhost:3000
node server.js 