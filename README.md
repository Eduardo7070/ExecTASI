# API de Pedidos — TASI II

API REST em Node.js, Express e JavaScript para cadastrar, listar, consultar e atualizar pedidos.

## Instalação e execução

Requer Node.js 20 ou superior. No terminal, dentro da pasta do projeto:

```sh
npm install
npm start
```

Endereço: `http://localhost:3000`. Para encerrar: Ctrl+C.
Porta opcional no PowerShell: `$env:PORT=3001; npm start`.
O armazenamento é em memória: os dados são apagados ao reiniciar a aplicação.

## Arquitetura

Fluxo: **routes → controllers → services → repositories**.

- `routes`: define os caminhos e métodos HTTP.
- `controllers`: recebe as requisições e envia as respostas.
- `services`: aplica as regras de negócio e transições de status.
- `repositories`: armazena os pedidos e gera IDs, usando um objeto indexado pelo ID.
- `validator.js`: valida os dados de criação.
- `middlewares/errorHandler.js`: trata erros em um único lugar.
- `app.js`: configura o Express; `server.js`: inicia o servidor.

O padrão Repository separa o armazenamento das regras de negócio, permitindo
substituir a memória por um banco de dados sem alterar os controllers.

## Endpoints

| Método | Rota | Respostas |
|---|---|---|
| POST | /pedidos | 201; dados inválidos: 400 |
| GET | /pedidos | 200 com lista |
| GET | /pedidos/:id | 200; inexistente: 404 |
| PATCH | /pedidos/:id/status | 200; inválido: 400; inexistente: 404 |

Enviar `Content-Type: application/json` em POST e PATCH.

POST `/pedidos`:

```json
{"cliente":"Carlos Silva","tipo":"entrega","valor":350,"prioridade":"normal"}
```

Resposta 201:

```json
{"id":1,"cliente":"Carlos Silva","tipo":"entrega","valor":350,"prioridade":"normal","status":"recebido"}
```

GET `/pedidos` retorna a lista; GET `/pedidos/1` retorna o pedido de ID 1.
PATCH `/pedidos/1/status` com `{"status":"cancelado"}` retorna o pedido atualizado.
Exemplo de erro 404: `{"erro":"Pedido não encontrado."}`.

## Validações e status

- Cliente: texto obrigatório, não vazio após remover espaços nas extremidades.
- Valor: número finito maior que zero. Strings como `"350"` não são aceitas.
- Tipo: `entrega` ou `retirada`.
- Prioridade: `normal` ou `alta`, apenas informativa.
- ID: inteiro positivo seguro, gerado automaticamente. ID inválido retorna 400.
- Status inicial: `recebido`. Campos extras na criação são ignorados.

| Status atual | Próximos estados permitidos |
|---|---|
| recebido | em_preparacao, cancelado |
| em_preparacao | enviado, cancelado |
| enviado | entregue |
| entregue | nenhum |
| cancelado | nenhum |

Não é permitido repetir status, voltar ou saltar etapas. Para retirada, `enviado`
significa disponível no balcão e `entregue` significa retirado pelo cliente.
O PATCH verifica a existência do ID antes de validar os campos.
Erros de validação e JSON malformado retornam 400; pedidos inexistentes, 404;
erros inesperados, 500 sem detalhes internos. O limite do corpo é 100 KB (413 se excedido).

## Testes

```sh
npm test
npm run test:coverage
```

Sete testes com Jest e Supertest cobrem criação, cliente vazio, listagem, consulta
por ID, pedido inexistente, atualização de status e transição não permitida.
O relatório de cobertura exclui os arquivos de teste e `server.js`.
O GitHub Actions executa os testes em pushes e pull requests na branch `main`.

Para os testes manuais, importe `postman/TASI.postman_collection.json` no Postman
e execute as requisições em ordem. A criação salva o ID usado na atualização.
O roteiro das cinco capturas obrigatórias está em `evidencias/README.md`.

## Uso de IA

Foi utilizada IA como apoio aos testes e à documentação.
Foi adotada a sugestão de uma tabela de transições para deixar explícitas as
mudanças de status permitidas. O armazenamento foi separado em Repository para
isolar a persistência das regras de negócio.
