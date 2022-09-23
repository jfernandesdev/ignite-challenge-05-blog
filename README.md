# Blog Spacetraveling.
Desafio 05 (Criando um projeto do zero) - Jornada Ignite by Rocketseat - Trilha ReactJS - Tema: "Blog" 📰

## Descrição
- [x] Listagem simples dos posts vindos do Prismic.io;
- [x] Botão de carregar mais posts (paginação);
- [x] Página do post com banner, título, autor, data de postagem e conteúdo;
- [x] Geração de páginas estáticas com os métodos getStaticProps e getStaticPaths;
- [x] Formatação de datas com date-fns;
- [x] Requisições HTTP com fetch.

###  Rodando a aplicação localmente

Primeiro, no Prismic crie um custom type repetível chamado `post` com 8 campos:
* `slug`: UID
* `title`: Key Text
* `subtitle`: Key Text
* `author`: Key Text
* `banner`: Image
* `content`: Group
  * `heading`: Key text
  * `body`: rich text

Além disso, não esqueça de configurar no arquivo .env.local na raiz do seu projeto a variável PRISMIC_API_ENDPOINT com a url da sua API (``Painel prismic > settings > API & Security > API Endpoint``)

> Em caso de dúvida dê uma olhada na documentação. 
  
Instale as depedências:
```sh
$ yarn install
```

Rode a aplicação localmente:
```sh
$ yarn dev 
```

## Layout 🤩

### Desktop (screenshot):

| Home | Post | 
| --- | --- |
| <img src="https://github.com/jfernandesdev/ignite-challenge-05-blog/blob/b7b1ba0847168b1633739e3e6ae3fc6073c9548c/public/desktop-1.png" /> |  <img src="https://github.com/jfernandesdev/ignite-challenge-05-blog/blob/b7b1ba0847168b1633739e3e6ae3fc6073c9548c/public/desktop-2.png" /> |
