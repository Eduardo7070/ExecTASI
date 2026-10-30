const express = require('express');
const pedidosRoutes = require('./routes/pedidosRoutes');
const errorHandler = require('./middlewares/errorHandler');
const app = express();

app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));
app.use('/pedidos', pedidosRoutes);
app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada.' }));
app.use(errorHandler);

module.exports = app;
