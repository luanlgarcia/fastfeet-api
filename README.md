Neste projeto você irá desenvolver uma API para a transportadora fictícia FastFeet. Essa aplicação deve gerenciar o ciclo completo das encomendas, implementando regras de negócio como permissões para administradores e entregadores, e a exigência de foto para confirmar a entrega.

Para auxiliar na visualização de como sua API será consumida, disponibilizamos um layout de referência da aplicação que fariam uso dos seus endpoints. Isso ajudará a compreender o propósito de cada funcionalidade.

https://www.figma.com/community/file/1550522126708534266


Instruções
Estrutura, regras e requisitos do projeto

Você será responsável por desenvolver a API (backend) da FastFeet (transportadora fictícia). Esta API gerenciará o cadastro de usuários (administradores e entregadores), o fluxo de encomendas e o registro de destinatários.

A API deve seguir um conjunto de funcionalidades e regras de negócio.

Funcionalidades da aplicação

[ ] A aplicação deve ter dois tipos de usuário, entregador e/ou admin
[ ] Deve ser possível realizar login com CPF e Senha
[ ] Deve ser possível realizar o CRUD dos entregadores
[ ] Deve ser possível realizar o CRUD das encomendas
[ ] Deve ser possível realizar o CRUD dos destinatários
[ ] Deve ser possível marcar uma encomenda como aguardando (Disponível para retirada)
[ ] Deve ser possível retirar uma encomenda
[ ] Deve ser possível marcar uma encomenda como entregue
[ ] Deve ser possível marcar uma encomenda como devolvida
[ ] Deve ser possível listar as encomendas com endereços de entrega próximo ao local do entregador
[ ] Deve ser possível alterar a senha de um usuário
[ ] Deve ser possível listar as entregas de um usuário
[ ] Deve ser possível notificar o destinatário a cada alteração no status da encomenda

Regras de negócio

[ ] Somente usuário do tipo admin pode realizar operações de CRUD nas encomendas
[ ] Somente usuário do tipo admin pode realizar operações de CRUD dos entregadores
[ ] Somente usuário do tipo admin pode realizar operações de CRUD dos destinatários
[ ] Para marcar uma encomenda como entregue é obrigatório o envio de uma foto
[ ] Somente o entregador que retirou a encomenda pode marcar ela como entregue
[ ] Somente o admin pode alterar a senha de um usuário
[ ] Não deve ser possível um entregador listar as encomendas de outro entregador

Conceitos que pode praticar
Este desafio foi desenhado para que você possa exercitar e aprofundar seus conhecimentos em:

Arquitetura e Design: Domain-Driven Design (DDD), Domain Events e Clean Architecture para criar um sistema robusto e escalável
Segurança: Autenticação e Autorização baseada em papéis (Role-Based Access Control - RBAC) para proteger suas rotas
Qualidade de Código: Implementação de testes unitários e de ponta a ponta (E2E) para garantir a confiabilidade da API
Integrações: Simulação de integração com serviços externos (ex: serviço de notificação)