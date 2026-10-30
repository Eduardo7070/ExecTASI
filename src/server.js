const app = require('./app');
const port = Number(process.env.PORT || 3000);

const server = app.listen(port, '127.0.0.1', () => {
  console.log(`API de pedidos: http://localhost:${port}/pedidos`);
});

server.on('error', error => {
  console.error(`Não foi possível iniciar a API: ${error.message}`);
  process.exitCode = 1;
});
