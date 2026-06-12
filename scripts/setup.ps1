$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

Write-Host "Instalando dependencias do servidor Node.js..."
Push-Location "server-node"
try {
    npm install
}
finally {
    Pop-Location
}

Write-Host "Criando ambiente Python em .venv..."
if (-not (Test-Path ".venv")) {
    python -m venv .venv
}

Write-Host "Instalando dependencias do cliente Python..."
& ".\.venv\Scripts\python.exe" -m pip install -r "client-python\requirements.txt"

Write-Host "Gerando stubs Python do gRPC..."
& ".\.venv\Scripts\python.exe" "client-python\src\rpg_client\client.py" --generate-only

Write-Host "Setup concluido."
