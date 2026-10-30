const service = require('../services/pedidosService');

function criar(req, res) {
  const pedido = service.criar(req.body);
  res.location('/pedidos/' + pedido.id).status(201).json(pedido);
}

function listar(req, res) {
  res.json(service.listar());
}

function buscar(req, res) {
  res.json(service.buscar(req.params.id));
}

function atualizarStatus(req, res) {
  res.json(service.atualizarStatus(req.params.id, req.body));
}

module.exports = { criar, listar, buscar, atualizarStatus };
