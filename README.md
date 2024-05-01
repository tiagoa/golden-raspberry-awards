# API RESTful para Golden Raspberry Awards

Este projeto consiste em uma API RESTful em Node.js para ler a lista de indicados e vencedores da categoria Pior Filme do Golden Raspberry Awards.

## Como rodar o projeto

1. Clone o repositório:

```
git clone https://github.com/tiagoa/golden-raspberry-awards.git
```

2. Instale as dependências:

```
npm install
```

3. Execute o servidor:

```
npm run start
```

O servidor estará rodando em `http://localhost:3000`.

## Rota disponível

- `/prize-range`: Retorna os produtores com o maior e menos intervalo entre dois prêmios consecutivos

4. Testes de integração:

```
npm run test
```