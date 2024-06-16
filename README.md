<div align="center" id="menu">

![logo](https://github.com/RatanabaOrg/back_end/assets/100284976/e96da343-9303-4902-986b-a4546261f532)

<h3> Aplicação mobile para registro e quantificação de pragas em campos agrícolas </h3>

</div> 

<br>

 ## :scroll: Manual de instalação

Antes de iniciar, certifique-se de ter instalado no seu sistema:
- Node.js (versão 18.20.1 ou superior)
- npm (versão 10.5.0 ou superior) ou Yarn (versão 1.22.19 ou superior)
- Python (versão 3.11 ou superior)

<br>

### Como executar

Siga os passos abaixo para executar o projeto localmente:

1. Clone o repositório:
  ```
  git clone https://github.com/RatanabaOrg/back_end.git
  ```
2. Instale as dependências:
  ```
  npm install
  ```
3. Inicie o microservico:
   - entre na pasta `microservico`
  ```
  python server.py
  ```
4. Inicie o servidor:
  ```
  node app.js
  ```

<br>

### Portas utilizadas

Usuários
- **/login**: POST - Recebe um json com: e retorna se o usario existe ou não
- **/usuario/cadastro**: POST - Recebe um json com: e retorna se o usuario foi ou não cadastrado
- **/usuario**: GET - Retorna todos os usuários
- **/usuario/:id**: DEL - Deleta o usuário respectivo ao id passado na rota
- **/usuario/:id**: GET - Retorna os dados do usuário respectivo ao id passado na rota
- **/usuario/:id**: PUT - Recebe um json com os dados para atualizar e atualiza o usuário respectivo ao id passado na rota
- **/usuario/completo/:id**: GET - Retorna os dados do usuário e todas dependências do mesmo: fazendas, talhões, armadilhas e endereço

Fazendas
- **/fazenda/cadastro**: POST - Recebe um json com: e retorna se o fazenda foi ou não cadastrada
- **/usuario**: GET - Retorna todos as fazendas
- **/fazenda/:id**: DEL - Deleta a fazenda respectiva ao id passado na rota
- **/fazenda/:id**: GET - Retorna os dados da fazenda respectiva ao id passado na rota
- **/fazenda/:id**: PUT - Recebe um json com os dados para atualizar e atualiza a fazenda respectiva ao id passado na rota
- **/fazenda/completo/:id**: GET - Retorna os dados da fazenda e todas dependências do mesmo: talhões e armadilhas

Talhões
- **/talhao/cadastro**: POST - Recebe um json com: e retorna se o usuario foi ou não cadastrado
- **/talhao**: GET - Retorna todos os talhões
- **/talhao/:id**: DEL - Deleta o talhão respectivo ao id passado na rota
- **/talhao/:id**: GET - Retorna os dados do talhão respectivo ao id passado na rota
- **/talhao/:id**: PUT - Recebe um json com os dados para atualizar e atualiza o talhão respectivo ao id passado na rota
- **/talhao/completo/:id**: GET - Retorna os dados do talhão e todas armadilhas do mesmo

Armadilhas
- **/armadilha/cadastro**: POST - Recebe um json com: e retorna se a armadilha foi ou não cadastrada
- **/armadilha**: GET - Retorna todos as armadilhas
- **/armadilha/:id**: DEL - Deleta a armadilha respectiva ao id passado na rota
- **/armadilha/:id**: GET - Retorna os dados da armadilha respectiva ao id passado na rota
- **/armadilha/:id**: PUT - Recebe um json com os dados para atualizar e atualiza a armadilha respectiva ao id passado na rota

<br>

<h2> 🗂 Repositórios </h2>

- Repositório Documentação: [https://github.com/RatanabaOrg/documentacao.git](https://github.com/RatanabaOrg/documentacao.git)

- Repositório Frontend: [https://github.com/RatanabaOrg/front_end.git](https://github.com/RatanabaOrg/front_end.git)

<br>
