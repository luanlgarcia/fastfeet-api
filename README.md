# FastFeet API

> 🚧 **Projeto em construção** — a camada de domínio está implementada e coberta por testes unitários. A camada de infraestrutura (banco de dados, HTTP, autenticação) ainda não foi iniciada.

API da transportadora fictícia **FastFeet**, desafio final da trilha de Node.js da Rocketseat. A aplicação gerencia o ciclo completo de encomendas — do cadastro de destinatários e entregadores até a entrega ou devolução do pacote.

O objetivo do desafio é exercitar **Domain-Driven Design**, **Clean Architecture**, **Domain Events** e testes automatizados.

Layout de referência: [Figma](https://www.figma.com/community/file/1550522126708534266)

---

## Status do desenvolvimento

O projeto está sendo construído **de dentro para fora**: primeiro o domínio completo com testes unitários, depois a infraestrutura.

| Camada | Status |
| --- | --- |
| Domínio (entidades, value objects, casos de uso) | ✅ Concluído |
| Testes unitários | ✅ Concluído |
| Notificações via Domain Events | 🚧 Em andamento |
| Infraestrutura (Prisma, HTTP, JWT, upload) | ⬜ Não iniciado |
| Testes E2E | ⬜ Não iniciado |

### Funcionalidades da aplicação

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

- [ ] Somente usuário do tipo admin pode realizar operações de CRUD nas encomendas
- [ ] Somente usuário do tipo admin pode realizar operações de CRUD dos entregadores
- [ ] Somente usuário do tipo admin pode realizar operações de CRUD dos destinatários
- [ ] Para marcar uma encomenda como entregue é obrigatório o envio de uma foto
- [x] Somente o entregador que retirou a encomenda pode marcar ela como entregue
- [ ] Somente o admin pode alterar a senha de um usuário
- [ ] Não deve ser possível um entregador listar as encomendas de outro entregador

---

## Arquitetura

O código segue Clean Architecture, separado em três camadas:

```
src/
├── core/                          # blocos de construção genéricos
│   ├── entities/                  # Entity, UniqueEntityID
│   ├── errors/                    # erros reaproveitáveis
│   ├── repositories/              # PaginationParams
│   └── types/
│
├── domain/orders/
│   ├── enterprise/                # regras de negócio da empresa
│   │   └── entities/              # Order, Addressee, DeliveryPerson, Admin
│   │       └── value-objects/     # Coordinate
│   │
│   └── application/               # regras de negócio da aplicação
│       ├── cryptography/          # contratos de hash e criptografia
│       ├── repositories/          # contratos de persistência
│       └── use-cases/             # casos de uso + erros específicos
│
└── infra/                         # (ainda não implementado)

test/
├── factories/                     # fábricas de entidades para testes
├── repositories/                  # implementações in-memory
└── cryptography/                  # dublês de hash e encrypter
```

O domínio não conhece NestJS, Prisma nem HTTP. Os casos de uso dependem apenas de contratos abstratos, o que permite testá-los com repositórios em memória.

### Ciclo de vida da encomenda

```
PENDING ──▶ WAITING ──▶ PICKED_UP ──┬──▶ DELIVERED
                                    └──▶ RETURNED
```

| Estado | Significado |
| --- | --- |
| `PENDING` | Encomenda cadastrada, ainda não liberada para retirada |
| `WAITING` | Postada e disponível para retirada |
| `PICKED_UP` | Retirada por um entregador |
| `DELIVERED` | Entregue ao destinatário |
| `RETURNED` | Devolvida |

Cada transição é um caso de uso próprio, com validação do estado de origem.

---

## Decisões de projeto

Alguns pontos do desafio admitem mais de uma leitura. As decisões tomadas e o raciocínio por trás delas:

**Admin e entregador são entidades separadas.** Apesar de ambos virarem uma única tabela de usuários com uma coluna `role` na persistência, no domínio são conceitos distintos com capacidades distintas. O modelo de domínio não precisa espelhar o modelo de banco — quem reconcilia os dois é o mapper na camada de infraestrutura.

**Autorização por papel fica na infraestrutura.** As regras do tipo "somente admin pode X" não dependem do estado do agregado — são sempre a mesma verificação sobre quem está chamando. Serão implementadas como guard do NestJS com a role no JWT, e não injetando um repositório de admins em cada caso de uso. Já as regras que dependem do dado ("somente o entregador que retirou pode entregar") vivem no domínio, onde podem ser testadas unitariamente.

**A devolução é feita pelo entregador que retirou.** O desafio não especifica quem pode devolver. Optou-se por espelhar a entrega, já que a devolução é o desfecho alternativo de uma tentativa de entrega — mesmo ator, mesmo momento do fluxo.

**Coordenadas geográficas são um value object.** Latitude e longitude nunca fazem sentido separadas, então formam um `Coordinate`, que também carrega o cálculo de distância como comportamento de domínio.

**Proximidade considera um raio de 10 km**, definido em `MAX_DISTANCE_IN_KILOMETERS`, e as encomendas retornam ordenadas da mais próxima para a mais distante.

---

## Tecnologias

- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vitest](https://vitest.dev/)
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/)

Ainda a integrar: Prisma, PostgreSQL, JWT e serviço de armazenamento de arquivos.

---

## Como executar

Pré-requisitos: Node.js 18+ e npm.

```bash
# instalar dependências
npm install

# rodar os testes unitários
npm test

# rodar os testes em modo watch
npm run test:watch

# verificar tipos
npx tsc --noEmit

# lint
npm run lint
```

Os testes unitários rodam inteiramente em memória — não é necessário banco de dados.
