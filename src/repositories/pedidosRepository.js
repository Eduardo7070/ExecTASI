
const pedidos = {};
let proximoId = 1;

function criar(dados) {
  const pedido = { ...dados, id: proximoId++ };
  pedidos[pedido.id] = pedido;
  return { ...pedido };
}

function listar() {
  return Object.values(pedidos).map(pedido => ({ ...pedido }));
}

function buscarPorId(id) {
  const pedido = pedidos[id];
  return pedido ? { ...pedido } : null;
}

function atualizarStatus(id, status) {
  const pedido = pedidos[id];
  if (!pedido) return null;
  pedido.status = status;
  return { ...pedido };
}

module.exports = { criar, listar, buscarPorId, atualizarStatus };
