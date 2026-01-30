# PowerShell script to open browser for testing
Write-Host "Opening browser for testing..." -ForegroundColor Cyan

# Open the debug page in default browser
Start-Process "http://localhost:3000/debug.html"

Write-Host "Debug page opened in browser." -ForegroundColor Green
Write-Host ""
Write-Host "Instructions:" -ForegroundColor Yellow
Write-Host "1. Click 'Run Full Test' button to check all resources"
Write-Host "2. Click 'Load Game' button to load the game"
Write-Host "3. Press F12 to open Developer Tools"
Write-Host "4. Check Console tab for any JavaScript errors"
Write-Host ""
Write-Host "If you see errors, please share them." -ForegroundColor Yellow
