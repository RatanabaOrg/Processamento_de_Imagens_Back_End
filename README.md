<div align="center" id="menu">

![logo](https://github.com/RatanabaOrg/documentacao/assets/100284976/3b3af8d0-a426-4abc-a3a4-d9f7981e3a5a)

<h3> Aplicação mobile para registro e quantificação de pragas em campos agrícolas </h3>

</div> 

<br>

## :pencil: Sobre o projeto

 O projeto propõe uma solução para um dos desafios fundamentais na agricultura brasileira: a contagem precisa de pragas nos campos. Atualmente, esse processo é feito manualmente, o que consome tempo e recursos. Com o intuito de simplificar essa tarefa, planejamos desenvolver um aplicativo que permitirá localizar armadilhas, capturar fotos e em seguida, processá-las para determinar a quantidade de pragas presentes. Essa iniciativa proporcionará aos agricultores informações mais rápidas e precisas sobre a aplicação de defensivos agrícolas, além de possibilitar um monitoramento mais eficiente das armadilhas utilizadas.

<br>

<h2> 🗂 Repositórios </h2>

- Repositório Documentação: [https://github.com/RatanabaOrg/documentacao.git](https://github.com/RatanabaOrg/documentacao.git)

- Repositório Frontend: [https://github.com/RatanabaOrg/front_end.git](https://github.com/RatanabaOrg/front_end.git)

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

## :busts_in_silhouette: Equipe

<div align="center">
  
|           Nome            |    Função     |        Redes profissionais        |
| :-----------------------: | :-----------: | :-------------------------------: |
| Amanda Vieira de Oliveira | Product Owner |  [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/amanda-vo/) <br> [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/amandavo) |
|   Lucas França Registro   |  Scrum Master | [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com) <br> [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/LucasFrancaRegistro) |
|  Carlos Eduardo Falandes  |    Dev Team   | [![Lattes Badge](https://img.shields.io/badge/-Lattes-orange?style=flat-square&logo=GitBook&logoColor=white&link=http://lattes.cnpq.br/2433599000300626)](http://lattes.cnpq.br/3579183651868833) <br> [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/Desduh) |
|    Júlia Sousa Gayotto    |    Dev Team   | [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/júlia-gayotto/) <br> [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/JuliaGayotto) |

</div>

<a href="#menu">Voltar ao topo</a>
