# Evidências obrigatórias do Postman

Status: capturas reais pendentes. Nenhuma imagem foi fabricada como se fosse uma captura.
Não foi encontrado Postman nos caminhos de instalação verificados nesta máquina.

1. Execute `npm start` na pasta TASI.
2. No Postman, importe `postman/TASI.postman_collection.json`.
3. Execute cada requisição na ordem da coleção (a primeira salva o ID automaticamente).
4. Faça capturas legíveis com método, URL resolvida, corpo enviado quando aplicável,
   resposta e código HTTP. Salve-as nesta pasta:

| Arquivo | Requisição | Esperado |
|---|---|---|
| 01-criacao.png | POST válido /pedidos | 201 e status recebido |
| 02-validacao.png | POST com cliente vazio | 400 e mensagem explicativa |
| 03-listagem.png | GET /pedidos | 200 e lista contendo o pedido |
| 04-consulta-inexistente.png | GET /pedidos/999999 | 404 |
| 05-atualizacao.png | PATCH /pedidos/{{pedidoId}}/status para cancelado | 200 |

Para repetir toda a sequência, execute novamente a criação (ela atualiza o ID).
Não repita apenas o cancelamento de um pedido já cancelado: isso deve retornar 400.

## Validação automatizada

A suíte foi reduzida a sete testes principais, conforme solicitado. Execute 
pm test para conferir o resultado. Esses testes complementam, mas não substituem, as capturas do Postman exigidas no enunciado. Não se mantém a afirmação de cobertura total da suíte anterior.
