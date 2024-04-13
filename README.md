<div align="center" id="menu">

![logo](https://github.com/RatanabaOrg/back_end/assets/100284976/e96da343-9303-4902-986b-a4546261f532)

<h3> Aplicação mobile para registro e quantificação de pragas em campos agrícolas </h3>

</div> 

<br>

 ## :scroll: Manual de instalação

Antes de iniciar, certifique-se de ter instalado no seu sistema:
- Node.js (versão 18.20.1 ou superior)
- npm (versão 10.5.0 ou superior) ou Yarn (versão 1.22.19 ou superior)

<br>

### Como executar

Siga os passos abaixo para executar o projeto localmente:

1. Clone o repositório:
  ```
  git clone https://github.com/RatanabaOrg/back_end.git
  ```
3. Instale as dependências:
  ```
  npm install
  ```
4. Configure o ambiente:
- Copie o arquivo `.env.example` para `.env`:
  ```
  cp .env.example .env
  ```
- Edite o arquivo `.env` com as configurações do seu ambiente, como strings de conexão do banco de dados, portas, etc.

5. Inicie o servidor:
  ```
  node app.js
  ```

O servidor estará rodando e acessível em `http://localhost:PORTA`, onde `PORTA` é a porta configurada no seu arquivo `.env`.

<br>

### Portas utilizadas

- **/login**: recebe um json com: e retorna se o usario existe ou não
- **/cadastro**: recebe um json com: e retorna se o usuario foi ou não cadastrado

<br>

<h2> 🗂 Repositórios </h2>

- Repositório Documentação: [https://github.com/RatanabaOrg/documentacao.git](https://github.com/RatanabaOrg/documentacao.git)

- Repositório Frontend: [https://github.com/RatanabaOrg/front_end.git](https://github.com/RatanabaOrg/front_end.git)

<br>
