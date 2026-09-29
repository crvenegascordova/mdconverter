# mdconverter - Automated Global Installer for Windows PowerShell (Node.js & Bun Compatible)

$ErrorActionPreference = "Stop"

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host " 🚀 Installing mdconverter globally (Windows)" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

# 1. Determine Runtime
$hasBun = Get-Command bun -ErrorAction SilentlyContinue
$hasNode = Get-Command node -ErrorAction SilentlyContinue
$hasNpm = Get-Command npm -ErrorAction SilentlyContinue

if ($hasBun) {
    Write-Host "✓ Found Bun runtime" -ForegroundColor Green
    $runtime = "bun"
} elseif ($hasNode -or $hasNpm) {
    Write-Host "✓ Found Node.js / npm runtime" -ForegroundColor Green
    $runtime = "node"
} else {
    Write-Host "❌ Error: Neither Bun nor Node.js/npm were found on your system." -ForegroundColor Red
    Write-Host "Please install Bun (https://bun.sh) or Node.js (https://nodejs.org) first." -ForegroundColor Yellow
    Exit 1
}

# 2. Install Dependencies
Write-Host "`n📦 Installing project dependencies..." -ForegroundColor Cyan
if ($runtime -eq "bun") {
    bun install
} else {
    npm install
}

# 3. Build Executable
Write-Host "`n⚙️ Building project..." -ForegroundColor Cyan
if ($runtime -eq "bun") {
    bun run build
} else {
    npm run build
}

# 4. Target Path for Windows
$targetDir = "$env:LOCALAPPDATA\Microsoft\WindowsApps"
if (-not (Test-Path $targetDir)) {
    $targetDir = "$env:USERPROFILE\.local\bin"
    New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
}

$sourceExe = Join-Path (Get-Location) "dist\mdconverter.exe"
if (-not (Test-Path $sourceExe)) {
    $sourceExe = Join-Path (Get-Location) "dist\mdconverter"
}

Write-Host "`n🔗 Installing 'mdconverter' to $targetDir..." -ForegroundColor Cyan

if (Test-Path $sourceExe) {
    Copy-Item -Path $sourceExe -Destination (Join-Path $targetDir "mdconverter.exe") -Force
} else {
    # Node wrapper batch file if binary is absent
    $batchContent = "@echo off`r`nnode `"%~dp0..\dist\index.js`" %*"
    Set-Content -Path (Join-Path $targetDir "mdconverter.cmd") -Value $batchContent
}

Write-Host "`n===================================================" -ForegroundColor Green
Write-Host " ✨ mdconverter installed successfully!" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green
Write-Host "You can now run mdconverter from ANY directory using Node.js or Bun:" -ForegroundColor White
Write-Host "  mdconverter mi_documento.md -f all`n" -ForegroundColor Cyan
