const path = require('node:path');

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const { BattleGame } = require('./gameState');

const PROTO_PATH = path.resolve(__dirname, '../../proto/battle.proto');
const HOST = process.env.RPG_SERVER_HOST || '0.0.0.0';
const PORT = process.env.RPG_SERVER_PORT || '50051';
const ADDRESS = `${HOST}:${PORT}`;

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const battlePackage = protoDescriptor.rpg.battle;
const game = new BattleGame();

function handleRpc(fn) {
  return (call, callback) => {
    try {
      callback(null, fn(call.request));
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        message: error.message || 'Erro interno no servidor da batalha.',
      });
    }
  };
}

function createServer() {
  const server = new grpc.Server();

  server.addService(battlePackage.BattleService.service, {
    getStatus: handleRpc(() => game.status()),
    attack: handleRpc((request) => game.attack(request.actor_name)),
    usePotion: handleRpc((request) => game.usePotion(request.actor_name)),
    resetBattle: handleRpc(() => game.resetBattle()),
  });

  return server;
}

function main() {
  const server = createServer();

  server.bindAsync(
    ADDRESS,
    grpc.ServerCredentials.createInsecure(),
    (error, boundPort) => {
      if (error) {
        throw error;
      }

      console.log(`Servidor RPG gRPC rodando em ${HOST}:${boundPort}`);
      console.log('Contrato battle.proto carregado.');
    },
  );

  process.on('SIGINT', () => {
    console.log('\nEncerrando servidor...');
    server.tryShutdown((error) => {
      if (error) {
        server.forceShutdown();
      }
      process.exit(error ? 1 : 0);
    });
  });
}

if (require.main === module) {
  main();
}

module.exports = {
  createServer,
};
