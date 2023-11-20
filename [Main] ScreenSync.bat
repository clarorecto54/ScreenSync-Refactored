@echo off

REM Run client scripts in the background
start cmd /k "cd .\client && npm run build && npm run https-server"

REM Run server script
cd .\server
npm run server
