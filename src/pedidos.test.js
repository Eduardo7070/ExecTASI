const request = require('supertest');
let app;

const pedido = {
  cliente: 'Carlos Silva',
  tipo: 'entrega',
  valor: 350,
  prioridade: 'normal'
};

beforeEach(() => {
  jest.resetModules();
  app = require('./app');
});

 test('Deve cadastrar um pedido com status recebido e retornar 201', async () => {
  const resposta = await request(app).post('/pedidos').send(pedido);

  expect(resposta.status).toBe(201);
  expect(resposta.body).toEqual({ ...pedido, id: 1, status: 'recebido' });
});

 test('Deve rejeitar cliente vazio com erro 400', async () => {
  const resposta = await request(app).post('/pedidos').send({ ...pedido, cliente: '   ' });

  expect(resposta.status).toBe(400);
  expect(resposta.body.erro).toBe('Cliente é obrigatório e deve ser um texto não vazio.');
});

 test('Deve listar os pedidos cadastrados', async () => {
  await request(app).post('/pedidos').send(pedido);
  const resposta = await request(app).get('/pedidos');

  expect(resposta.status).toBe(200);
  expect(resposta.body).toEqual([{ ...pedido, id: 1, status: 'recebido' }]);
});

 test('Deve consultar um pedido pelo ID', async () => {
  await request(app).post('/pedidos').send(pedido);
  const resposta = await request(app).get('/pedidos/1');

  expect(resposta.status).toBe(200);
  expect(resposta.body).toEqual({ ...pedido, id: 1, status: 'recebido' });
});

 test('Deve retornar 404 para pedido inexistente', async () => {
  const resposta = await request(app).get('/pedidos/999');

  expect(resposta.status).toBe(404);
  expect(resposta.body.erro).toBe('Pedido não encontrado.');
});

 test('Deve atualizar o status para cancelado', async () => {
  await request(app).post('/pedidos').send(pedido);
  const resposta = await request(app).patch('/pedidos/1/status').send({ status: 'cancelado' });

  expect(resposta.status).toBe(200);
  expect(resposta.body.status).toBe('cancelado');
  const consulta = await request(app).get('/pedidos/1');
  expect(consulta.body.status).toBe('cancelado');
});

 test('Deve rejeitar uma transição de status não permitida', async () => {
  await request(app).post('/pedidos').send(pedido);
  const resposta = await request(app).patch('/pedidos/1/status').send({ status: 'entregue' });

  expect(resposta.status).toBe(400);
  expect(resposta.body.erro).toBe('Transição de recebido para entregue não permitida.');
  const consulta = await request(app).get('/pedidos/1');
  expect(consulta.body.status).toBe('recebido');
});
