const HttpError = require('../errors/HttpError');

module.exports = function errorHandler(err, req, res, next) {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ erro: 'JSON malformado.' });
  if (err.type === 'entity.too.large') return res.status(413).json({ erro: 'Corpo excede o limite de 100 KB.' });
  if (err instanceof HttpError) return res.status(err.status).json({ erro: err.message });
  console.error('Erro inesperado:', err);
  return res.status(500).json({ erro: 'Erro interno do servidor.' });
};
