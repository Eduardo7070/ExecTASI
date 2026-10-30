const HttpError = require('./errors/HttpError');



function validarObjeto(dados) {
  if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
    throw new HttpError(400, 'O corpo deve ser um objeto JSON.');
  }
}

function validarPedido(dados) {
  validarObjeto(dados);
  const { cliente, tipo, valor, prioridade } = dados;
  if (typeof cliente !== 'string' || !cliente.trim()) {
    throw new HttpError(400, 'Cliente é obrigatório e deve ser um texto não vazio.');
  }
  if (typeof valor !== 'number' || !Number.isFinite(valor) || valor <= 0) {
    throw new HttpError(400, 'Valor deve ser numérico, finito e maior que zero.');
  }
  if (tipo !== 'entrega' && tipo !== 'retirada') throw new HttpError(400, 'Tipo deve ser entrega ou retirada.');
  if (prioridade !== 'normal' && prioridade !== 'alta') throw new HttpError(400, 'Prioridade deve ser normal ou alta.');
  return true;
}

module.exports = { validarPedido, validarObjeto };
