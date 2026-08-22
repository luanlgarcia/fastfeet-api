# FastFeet API

API REST para a transportadora fictícia FastFeet, que gerencia o ciclo completo de encomendas: do cadastro de destinatários e entregadores até a entrega ou devolução do pacote.

Este é o desafio final da trilha de Node.js da Rocketseat. O objetivo é exercitar Domain-Driven Design, Clean Architecture, Domain Events e testes automatizados em uma aplicação NestJS.

Layout de referência: [Figma](https://www.figma.com/community/file/1550522126708534266)

## Tecnologias

| Camada | Ferramentas |
| --- | --- |
| Runtime e framework | Node.js, NestJS 11, TypeScript |
| Persistência | PostgreSQL, Prisma 7 |
| Autenticação | JWT com RS256, Passport |
| Armazenamento de arquivos | Cloudflare R2 via AWS SDK v3 |
| Validação | Zod |
| Testes | Vitest, Supertest |
| Qualidade | ESLint, Prettier |
| Infraestrutura local | Docker Compose |

## Arquitetura

O código segue Clean Architecture, separado em camadas com dependências apontando sempre para dentro. O domínio não conhece NestJS, Prisma nem HTTP: os casos de uso dependem apenas de contratos abstratos, o que permite testá-los com repositórios em memória.

```
src/
├── core/                          blocos de construção genéricos
│   ├── entities/                  Entity, AggregateRoot, UniqueEntityID, ValueObject
│   ├── errors/                    erros reaproveitáveis
│   ├── events/                    DomainEvents, DomainEvent, EventHandler
│   ├── repositories/              PaginationParams
│   └── either.ts                  tipo de retorno de sucesso ou falha
│
├── domain/
│   ├── orders/                    contexto principal
│   │   ├── enterprise/
│   │   │   ├── entities/          Order, Addressee, DeliveryPerson, Admin, DeliveryPhoto
│   │   │   │   └── value-objects/ Coordinate, OrderDetails
│   │   │   └── events/            OrderStatusChangedEvent
│   │   └── application/
│   │       ├── cryptography/      contratos de hash e criptografia
│   │       ├── storage/           contrato de upload
│   │       ├── repositories/      contratos de persistência
│   │       └── use-cases/         22 casos de uso e seus erros
│   │
│   └── notification/              contexto de notificações
│       ├── enterprise/entities/   Notification
│       └── application/
│           ├── repositories/
│           ├── subscribers/       OnOrderStatusChanged
│           └── use-cases/         SendNotification, ReadNotification
│
└── infra/                         implementações concretas
    ├── auth/                      estratégia JWT, guards de autenticação e papel
    ├── cryptography/              BcryptHasher, JwtEncrypter
    ├── database/prisma/           PrismaService, mappers e repositórios
    ├── env/                       validação das variáveis de ambiente com Zod
    ├── events/                    registro dos subscribers de domínio
    ├── http/                      controllers, presenters e pipes
    └── storage/                   R2Storage

test/
├── factories/                     fábricas de entidades para testes
├── repositories/                  implementações em memória
├── cryptography/                  dublês de hash e encrypter
├── storage/                       dublê de uploader
├── e2e/                           fixtures de teste
└── utils/                         helpers
```

### Ciclo de vida da encomenda

```
PENDING ---> WAITING ---> PICKED_UP ---> DELIVERED
                                    \
                                     --> RETURNED
```

| Estado | Significado |
| --- | --- |
| `PENDING` | Encomenda cadastrada, ainda não liberada para retirada |
| `WAITING` | Postada e disponível para retirada |
| `PICKED_UP` | Retirada por um entregador |
| `DELIVERED` | Entregue ao destinatário |
| `RETURNED` | Devolvida |

Cada transição é um caso de uso próprio, com validação do estado de origem. Qualquer mudança de status emite um `OrderStatusChangedEvent`, e o destinatário é notificado por um subscriber no contexto de notificações.

## Rotas

Todas as rotas exigem autenticação via `Authorization: Bearer <token>`, exceto onde indicado. A coluna Acesso indica a restrição por papel aplicada pelo `RolesGuard`.

### Autenticação e contas

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| `POST` | `/sessions` | Público | Login com CPF e senha, devolve o access token |
| `POST` | `/accounts` | Admin | Cadastra um entregador |
| `PATCH` | `/accounts/:id/reset-password` | Admin | Redefine a senha de um usuário |

### Entregadores

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| `GET` | `/delivery-persons/:id` | Admin | Detalha um entregador |
| `PUT` | `/delivery-persons/:id` | Admin | Edita um entregador |
| `DELETE` | `/delivery-persons/:id` | Admin | Remove um entregador |
| `GET` | `/delivery-persons/orders` | Autenticado | Lista as encomendas do próprio entregador |

### Destinatários

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| `POST` | `/addressees` | Admin | Cadastra um destinatário |
| `GET` | `/addressees/:id` | Admin | Detalha um destinatário |
| `PUT` | `/addressees/:id` | Admin | Edita um destinatário |
| `DELETE` | `/addressees/:id` | Admin | Remove um destinatário |

### Encomendas

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| `POST` | `/orders` | Admin | Cadastra uma encomenda |
| `GET` | `/orders/:id` | Admin | Detalha uma encomenda |
| `PUT` | `/orders/:id` | Admin | Edita uma encomenda |
| `DELETE` | `/orders/:id` | Admin | Remove uma encomenda |
| `PATCH` | `/orders/:id/post` | Admin | Marca como aguardando retirada |
| `PATCH` | `/orders/:id/pick-up` | Autenticado | Retira a encomenda |
| `PATCH` | `/orders/:id/deliver` | Autenticado | Marca como entregue, exige `deliveryPhotoId` |
| `PATCH` | `/orders/:id/return` | Autenticado | Marca como devolvida |
| `GET` | `/orders/nearby` | Autenticado | Lista encomendas próximas, exige `latitude` e `longitude` |

### Fotos de entrega

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| `POST` | `/delivery-photos` | Autenticado | Envia a foto do comprovante, devolve o `deliveryPhotoId` |

Nas rotas do ciclo de vida da encomenda o entregador é sempre lido do token, nunca do corpo ou da URL da requisição.

## Requisitos do desafio

### Funcionalidades

- [x] A aplicação deve ter dois tipos de usuário, entregador e/ou admin
- [x] Deve ser possível realizar login com CPF e senha
- [x] Deve ser possível realizar o CRUD dos entregadores
- [x] Deve ser possível realizar o CRUD das encomendas
- [x] Deve ser possível realizar o CRUD dos destinatários
- [x] Deve ser possível marcar uma encomenda como aguardando (disponível para retirada)
- [x] Deve ser possível retirar uma encomenda
- [x] Deve ser possível marcar uma encomenda como entregue
- [x] Deve ser possível marcar uma encomenda como devolvida
- [x] Deve ser possível listar as encomendas com endereços de entrega próximos ao local do entregador
- [x] Deve ser possível alterar a senha de um usuário
- [x] Deve ser possível listar as entregas de um usuário
- [x] Deve ser possível notificar o destinatário a cada alteração no status da encomenda

### Regras de negócio

- [x] Somente usuário do tipo admin pode realizar operações de CRUD nas encomendas
- [x] Somente usuário do tipo admin pode realizar operações de CRUD dos entregadores
- [x] Somente usuário do tipo admin pode realizar operações de CRUD dos destinatários
- [x] Para marcar uma encomenda como entregue é obrigatório o envio de uma foto
- [x] Somente o entregador que retirou a encomenda pode marcar ela como entregue
- [x] Somente o admin pode alterar a senha de um usuário
- [x] Não deve ser possível um entregador listar as encomendas de outro entregador

## Decisões de projeto

Alguns pontos do desafio admitem mais de uma leitura. As decisões tomadas e o raciocínio por trás delas:

**Admin e entregador são entidades separadas.** Apesar de ambos virarem uma única tabela de usuários com uma coluna `role` na persistência, no domínio são conceitos distintos com capacidades distintas. O modelo de domínio não precisa espelhar o modelo de banco: quem reconcilia os dois é o mapper na camada de infraestrutura.

**Autorização por papel fica na infraestrutura.** As regras do tipo "somente admin pode X" não dependem do estado do agregado, são sempre a mesma verificação sobre quem está chamando. Estão implementadas como um `RolesGuard` global que lê a role do JWT, e não injetando um repositório de admins em cada caso de uso. Já as regras que dependem do dado, como "somente o entregador que retirou pode entregar", vivem no domínio, onde podem ser testadas unitariamente.

**Identidade nunca vem da requisição.** As rotas do ciclo de vida da encomenda leem o entregador do `sub` do token, e a listagem de encomendas do entregador não tem parâmetro de rota. Regras de propriedade validadas contra um identificador que o próprio cliente escolhe não protegem nada, então o dado é lido de onde não pode ser forjado.

**A devolução é feita pelo entregador que retirou.** O desafio não especifica quem pode devolver. Optou-se por espelhar a entrega, já que a devolução é o desfecho alternativo de uma tentativa de entrega: mesmo ator, mesmo momento do fluxo.

**Coordenadas geográficas são um value object.** Latitude e longitude nunca fazem sentido separadas, então formam um `Coordinate`, que também carrega o cálculo de distância como comportamento de domínio.

**Proximidade considera um raio de 10 km**, definido em `MAX_DISTANCE_IN_KILOMETERS`, e as encomendas retornam ordenadas da mais próxima para a mais distante.

**Um único evento de domínio para as mudanças de status.** O requisito fala em notificar "a cada alteração no status", que é um conceito só, e hoje as quatro transições produzem a mesma reação. Em vez de quatro eventos específicos, existe um `OrderStatusChangedEvent` e um mapa de status para mensagem. Se alguma transição passar a exigir tratamento próprio, o evento específico é extraído nesse momento.

**A foto de entrega é uma entidade, não uma URL na encomenda.** Ela tem tabela própria, e a encomenda guarda apenas `deliveryPhotoId`. Como a relação é 1:1, não existe tabela de junção nem lista observada. O upload é um caso de uso separado que valida o tipo do arquivo, aceitando apenas JPEG e PNG, e devolve a foto criada; a entrega recebe o ID e faz o vínculo.

## Testes

A suíte é dividida em dois níveis, com objetivos distintos.

Os testes unitários cobrem as regras de negócio dos casos de uso contra repositórios em memória. Rodam sem banco, sem rede e sem container.

Os testes end-to-end cobrem o wiring: rotas, guards, serialização, mapeamento para o banco e integração com serviços externos. Cada arquivo cria um schema PostgreSQL isolado, aplica as migrations nele e o descarta ao final, o que permite rodá-los em paralelo sem interferência.

| Suíte | Arquivos | Comando |
| --- | --- | --- |
| Unitários | 28 | `npm test` |
| End-to-end | 22 | `npm run test:e2e` |

O teste de upload envia um arquivo para o bucket R2 configurado, portanto exige credenciais válidas e acesso à rede.

## Como executar

Pré-requisitos: Node.js 20 ou superior, npm e Docker.

### 1. Instalar dependências

```bash
npm install
```

### 2. Subir o banco de dados

```bash
docker compose up -d
```

O container expõe o PostgreSQL na porta 5432, com o banco `fastfeet`.

### 3. Gerar as chaves JWT

A autenticação usa RS256, então são necessárias uma chave privada e uma pública, ambas em base64:

```bash
openssl genrsa -out private.key 2048
openssl rsa -in private.key -pubout -out public.key
base64 -w 0 private.key
base64 -w 0 public.key
```

### 4. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz:

```env
DATABASE_URL="postgresql://postgres:docker@localhost:5432/fastfeet?schema=public"
PORT=3333

JWT_PRIVATE_KEY=""
JWT_PUBLIC_KEY=""

CLOUDFLARE_ACCOUNT_ID=""
AWS_BUCKET_NAME=""
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
```

As variáveis são validadas na inicialização por um schema Zod em `src/infra/env/env.ts`; a aplicação não sobe se alguma estiver faltando.

### 5. Aplicar as migrations

```bash
npx prisma migrate deploy
```

### 6. Iniciar a aplicação

```bash
npm run start:dev
```

### Outros comandos

```bash
npm run build          # compila para dist/
npm test               # testes unitários
npm run test:watch     # testes unitários em modo watch
npm run test:e2e       # testes end-to-end
npm run test:cov       # cobertura
npm run lint           # ESLint com correção automática
npx tsc --noEmit       # verificação de tipos
```
