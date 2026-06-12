$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

if (Test-Path ".venv\Scripts\python.exe") {
    & ".\.venv\Scripts\python.exe" "client-python\src\rpg_client\client.py" @args
} else {
    python "client-python\src\rpg_client\client.py" @args
}
