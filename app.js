const express = require('express');
const bodyParser = require('body-parser');
const { Usuario } = require('./models/usuario');


const app = express();
app.use(bodyParser.json());

app.post('/login', async (req, res) => {
    var usuario = new Usuario();
    try {
        var resultado = await usuario.login(req.body); 
        res.send(resultado);
    } catch (error) {
        res.status(500).send("Erro ao processar o login"); 
    }
});



app.post('/cadastro', async (req, res) => {
    var usuario = new Usuario();
    try {
        var resultado = await usuario.cadastro(req.body); // Aguarda a Promise ser resolvida
        res.send(resultado); // Envia o resultado ao cliente
    } catch (error) {
        // Em caso de erro durante o cadastro, envia uma mensagem de erro ao cliente
        res.status(500).send("Erro durante o processo de cadastro.");
    }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
