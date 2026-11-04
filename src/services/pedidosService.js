const HttpError = require('../errors/HttpError');
const { validarPedido, validarObjeto } = require('../validator');
const repository = require('../repositories/pedidosRepository');

const transicoes = {
  recebido: ['em_preparacao', 'cancelado'],
  em_preparacao: ['enviado', 'cancelado'],
  enviado: ['entregue'],
  entregue: [],
  cancelado: []
};

function criar(dados) {
  validarPedido(dados);
  return repository.criar({
    cliente: dados.cliente.trim(),
    tipo: dados.tipo,
    valor: dados.valor,
    prioridade: dados.prioridade,
    status: 'recebido'
  });
}

function listar() {
  return repository.listar();
}

function buscar(id) {
  const numeroId = Number(id);
  if (!Number.isSafeInteger(numeroId) || numeroId <= 0) {
    throw new HttpError(400, 'O ID deve ser um inteiro positivo seguro.');
  }
  const pedido = repository.buscarPorId(numeroId);
  if (!pedido) throw new HttpError(404, 'Pedido não encontrado.');
  return pedido;
}

function atualizarStatus(id, dados) {
  const pedido = buscar(id);
  validarObjeto(dados);
  const { status } = dados;
  if (!['recebido', 'em_preparacao', 'enviado', 'entregue', 'cancelado'].includes(status)) {
    throw new HttpError(400, 'Status inválido. Use recebido, em_preparacao, enviado, entregue ou cancelado.');
  }
  if (!transicoes[pedido.status].includes(status)) {
    throw new HttpError(400, 'Transição de ' + pedido.status + ' para ' + status + ' não permitida.');
  }
  return repository.atualizarStatus(pedido.id, status);
}

module.exports = { criar, listar, buscar, atualizarStatus };
