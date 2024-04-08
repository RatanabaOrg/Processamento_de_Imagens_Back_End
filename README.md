# Ratanaba View 

Breve descrição do projeto, incluindo o que ele faz e para quem é destinado.

## Pré-requisitos

Antes de iniciar, certifique-se de ter instalado no seu sistema:
- Node.js (versão X.X ou superior)
- npm (versão X.X ou superior) ou Yarn (versão X.X ou superior)

## Como Executar

Siga os passos abaixo para executar o projeto localmente:

1. Clone o repositório:
  ```
  git clone URL_DO_REPOSITORIO
  ```
2. Entre no diretório do projeto:
  ```
  cd NOME_DO_DIRETORIO
  ```
4. Instale as dependências:
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

## Portas Utilizadas

- **/login**: recebe um json com:
 e retorna se o usario existe ou não
- **/cadastro**: recebe um json com:
 e retorna se o usuario foi ou naão cafastrado

