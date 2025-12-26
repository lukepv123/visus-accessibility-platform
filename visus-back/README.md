#  Projeto de TCC

API do projeto de TCC desenvolvido para a obtenção do título de Tecnólogo em análise e desenvolvimento de sistemas pela Fatec São Caetano do Sul - Antonio Russo.

## Membros do Projeto

- Gustavo Gimenez Correa
- Gustavo Torres Zaia
- Lucas Gomes Pereira da Silva
- Lucas Petenusso Viana
- Vinícius Bispo Passacantili
- Vitor Martin Doja

## Stacks

- Back-end : Java Spring

- DB : MySQL  

## Regras

- Nunca mergear diretamente na main
- Sempre criar uma branch e criar um pull request para cada feature desenvolvida
- Todo Pull Request deve ser aceito após 1 review

### Padrões de Commit

- As ações deverão ser feitas em branches vinculadas à branch **'staging'** (desenvolvimento), para posteriormente serem adicionadas à branch **'prod'** (deploy)
- Toda nova funcionalidade deve ser criada em uma branch chamada `feat/`, e todas as correções deverão ser criadas em uma  `fix/`
- As branches devem começar com o nome da ação (`feat/` ou `fix/`)

#### Exemplo

Depois do pull na branch `staging`:

```
git checkout staging
git checkout -b feat/criar-funcionalidade-blablabla
```


