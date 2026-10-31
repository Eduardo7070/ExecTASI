# API de Pedidos — TASI II

Exercício em Node.js, Express e JavaScript, com armazenamento em memória.
Base de organização: https://github.com/Eduardo7070/topicos-avancados2-sm
Repositório de entrega: https://github.com/Eduardo7070/ExecTASI
Aluno e RA: preencher antes de entregar.

## Executar

Requer Node.js 20 ou superior. Abra o terminal em `C:\TASI`:

```sh
npm install
npm start
```

API: `http://localhost:3000/pedidos`. Ctrl+C encerra.
Os dados são apagados ao reiniciar. Não é necessário banco de dados.
Para mudar a porta no PowerShell: `$env:PORT=3001; npm start`.

## Estrutura e padrão

O projeto segue o estilo simples do repositório-base: funções, arquivo de
validação separado, testes junto ao código e testes no GitHub Actions.
Foi mantido JavaScript, conforme o enunciado, embora o exemplo use TypeScript.

```text
src/
  app.js                       configura o Express
  server.js                    inicia o servidor
  validator.js                 valida dados de criação
  pedidos.test.js               testes da API
  routes/pedidosRoutes.js       define as rotas
  controllers/pedidosController.js  recebe requisições e responde
  services/pedidosService.js    regras de negócio e array de pedidos
  errors/HttpError.js           identifica erros esperados
  middlewares/errorHandler.js  converte erros em respostas JSON
```

Padrão: arquitetura em camadas (routes → controllers → services).
O service guarda os pedidos em um array e controla as transições. O validator
verifica os campos. O controller cuida das respostas HTTP. Não há camada de
repositório nem criação de instâncias de services/controllers.

## Rotas e exemplos

| Método | Caminho | Resposta |
|---|---|---|
| POST | /pedidos | 201; dados inválidos: 400 |
| GET | /pedidos | 200 com lista |
| GET | /pedidos/:id | 200; inexistente: 404 |
| PATCH | /pedidos/:id/status | 200; inválido: 400; inexistente: 404 |

Use `Content-Type: application/json` no POST e PATCH.

POST `/pedidos`:

```json
{"cliente":"Carlos Silva","tipo":"entrega","valor":350,"prioridade":"normal"}
```

Resposta 201:

```json
{"id":1,"cliente":"Carlos Silva","tipo":"entrega","valor":350,"prioridade":"normal","status":"recebido"}
```

GET `/pedidos` retorna um array com os pedidos; GET `/pedidos/1` retorna um pedido.
PATCH `/pedidos/1/status` com `{"status":"cancelado"}` retorna o pedido atualizado.
Exemplo de erro 404: `{"erro":"Pedido não encontrado."}`.

## Regras

- Cliente: texto obrigatório, não vazio após remover espaços das extremidades.
- Valor: número finito maior que zero; texto como `"350"` não é aceito.
- Tipo: `entrega` ou `retirada`.
- Prioridade: `normal` ou `alta`, apenas informativa.
- ID: inteiro positivo gerado automaticamente. ID malformado retorna 400;
  ID válido não cadastrado retorna 404.
- Status inicial: `recebido`. Campos extras são ignorados na criação.

| Status atual | Pode mudar para |
|---|---|
| recebido | em_preparacao ou cancelado |
| em_preparacao | enviado ou cancelado |
| enviado | entregue |
| entregue | nenhum |
| cancelado | nenhum |

Não se permite saltar etapas, voltar ou repetir o status. Para retirada,
`enviado` significa disponível no balcão e `entregue` significa retirado.
O PATCH verifica o ID antes dos campos; JSON malformado é rejeitado antes da rota.
Erros de validação retornam 400 com mensagem JSON; erros inesperados retornam
500 sem expor detalhes internos. Corpo acima de 100 KB retorna 413.

## Testes e Postman

```sh
npm test
npm run test:coverage
```

São sete testes com Jest e Supertest: criação, cliente vazio, listagem, consulta por ID, pedido inexistente, atualização de status e transição não permitida. A suíte cobre os cenários principais, não todas as validações e falhas possíveis.
Os módulos são recarregados antes de cada teste de API para limpar o array.
O relatório de cobertura exclui apenas testes e `server.js`.
O GitHub Actions executa `npm ci` e `npm test` em pushes e PRs na main.

Importe `postman/TASI.postman_collection.json` no Postman e execute em ordem.
A primeira requisição salva o ID usado no PATCH. As cinco capturas reais ainda
estão pendentes; siga `evidencias/README.md`. Testes não substituem os prints.

## Git e entrega

O repositório foi recriado e está preparado para revisão e commits manuais do aluno.
A branch local é `main` e o remoto `origin` aponta para o repositório de entrega.
Nenhum commit ou push foi realizado nesta nova configuração.

Revise os arquivos antes de usar `git add` e `git commit`. O enunciado pede pelo
menos cinco commits significativos: registre etapas reais de revisão e ajustes,
como estrutura, validações, rotas, testes e documentação/evidências. Ao terminar
os commits revisados, envie com `git push -u origin main`.

Não versionar node_modules, credenciais ou cobertura. Antes de entregar,
preencha nome/RA, adicione os prints do Postman e entregue o link do repositório.

## Uso de IA

O Codex foi utilizado para interpretar o enunciado, implementar, simplificar,
testar e documentar a API. A sugestão inicial de usar Repository foi substituída
por um array no service a pedido do usuário, para aproximar o código do exemplo
fornecido. A tabela de transições foi mantida porque facilita entender e validar
as mudanças de status. O aluno deve revisar, compreender e justificar o código;
não se afirma que essa revisão já ocorreu.

