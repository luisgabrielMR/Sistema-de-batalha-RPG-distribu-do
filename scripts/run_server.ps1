$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

Push-Location "server-node"
try {
    npm start
}
finally {
    Pop-Location
}
