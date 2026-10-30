const HttpError = require('../errors/HttpError');
const { validarPedido, validarObjeto } = require('../validator');

const pedidos = [];
let proximoId = 1;

const transicoes = {
  recebido: ['em_preparacao', 'cancelado'],
  em_preparacao: ['enviado', 'cancelado'],
  enviado: ['entregue'],
  entregue: [],
  cancelado: []
};

function criar(dados) {
  validarPedido(dados);
  const pedido = {
    id: proximoId++,
    cliente: dados.cliente.trim(),
    tipo: dados.tipo,
    valor: dados.valor,
    prioridade: dados.prioridade,
    status: 'recebido'
  };
  pedidos.push(pedido);
  return { ...pedido };
}

function listar() {
  return pedidos.map(pedido => ({ ...pedido }));
}

function buscar(id) {
  const numeroId = Number(id);
  if (!Number.isSafeInteger(numeroId) || numeroId <= 0) {
    throw new HttpError(400, 'O ID deve ser um inteiro positivo seguro.');
  }
  const pedido = pedidos.find(pedido => pedido.id === numeroId);
  if (!pedido) throw new HttpError(404, 'Pedido não encontrado.');
  return { ...pedido };
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
  const indice = pedidos.findIndex(item => item.id === pedido.id);
  pedidos[indice].status = status;
  return { ...pedidos[indice] };
}

module.exports = { criar, listar, buscar, atualizarStatus };
