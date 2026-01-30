# PowerShell script to test the web page
Write-Host "Testing http://localhost:3000..." -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 10
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green

    # Check if page contains expected elements
    $content = $response.Content

    if ($content -match '<div id="app"') {
        Write-Host "✓ Found #app div" -ForegroundColor Green
    } else {
        Write-Host "✗ Missing #app div" -ForegroundColor Red
    }

    if ($content -match 'src="/src/main.js"') {
        Write-Host "✓ Found main.js script" -ForegroundColor Green
    } else {
        Write-Host "✗ Missing main.js script" -ForegroundColor Red
    }

    if ($content -match 'themes.css') {
        Write-Host "✓ Found CSS links" -ForegroundColor Green
    } else {
        Write-Host "✗ Missing CSS links" -ForegroundColor Red
    }

    # Test critical endpoints
    $endpoints = @(
        "/src/main.js",
        "/styles/main.css",
        "/styles/themes.css",
        "/assets/data/monsters.json",
        "/assets/data/blades.json"
    )

    Write-Host "`nTesting endpoints..." -ForegroundColor Cyan
    foreach ($endpoint in $endpoints) {
        try {
            $resp = Invoke-WebRequest -Uri "http://localhost:3000$endpoint" -Method GET -TimeoutSec 5
            Write-Host "✓ $endpoint - $($resp.StatusCode)" -ForegroundColor Green
        } catch {
            Write-Host "✗ $endpoint - $($_.Exception.Message)" -ForegroundColor Red
        }
    }

} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
