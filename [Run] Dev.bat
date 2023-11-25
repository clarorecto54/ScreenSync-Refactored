@echo off
REM Run client scripts in the background
cd .\client
start /max msedge.exe "https://localhost:3000" && npm run dev --experimental-https
pause