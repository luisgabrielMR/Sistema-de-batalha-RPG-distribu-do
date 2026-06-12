# Sistema de Batalha RPG Distribuido

Projeto demonstrando uma batalha RPG distribuida com gRPC:

- Servidor em Node.js, carregando `proto/battle.proto` dinamicamente com `@grpc/proto-loader`.
- Cliente em Python, gerando stubs gRPC com `grpcio-tools` e exibindo a batalha com Rich.
- Contrato compartilhado em Protocol Buffers, com metodos `GetStatus`, `Attack`, `UsePotion` e `ResetBattle`.

## Estrutura

```text
.
├── proto/
│   └── battle.proto
├── server-node/
│   ├── package.json
│   └── src/
│       ├── gameState.js
│       └── server.js
├── client-python/
│   ├── requirements.txt
│   └── src/rpg_client/
│       ├── client.py
│       └── generated/
└── scripts/
    ├── setup.ps1
    ├── run_server.ps1
    └── run_client.ps1
```

## Como rodar no Windows

No PowerShell, dentro da pasta do projeto:

```powershell
.\scripts\setup.ps1
```

Abra um terminal para o servidor:

```powershell
.\scripts\run_server.ps1
```

Abra outro terminal para o cliente:

```powershell
.\scripts\run_client.ps1
```

Para testar uma chamada automatica sem jogar interativamente:

```powershell
.\scripts\run_client.ps1 --demo
```

## Comandos manuais equivalentes

Servidor:

```powershell
cd server-node
npm install
npm start
```

Cliente:

```powershell
cd ..
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r client-python\requirements.txt
.\.venv\Scripts\python.exe client-python\src\rpg_client\client.py
```

## O que esta respeitando o gRPC

- O arquivo `proto/battle.proto` e o contrato unico entre as duas linguagens.
- O servidor Node.js registra o servico `BattleService` e implementa RPCs unarias.
- O cliente Python cria um `BattleServiceStub` e chama os metodos remotos como RPCs reais.
- A porta padrao e `localhost:50051`, usando credenciais inseguras apenas para ambiente local/didatico.
