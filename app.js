const express = require('express');
const bodyParser = require('body-parser');
const { Usuario } = require('./models/usuario');
const usuario = require('./models/usuario');


const app = express();
app.use(bodyParser.json());


app.post('/usuario/cadastro', async (req, res) => {
    var usuario = new Usuario();
    try {
        var resultado = await usuario.cadastro(req.body);
        res.send(resultado); 
    } catch (error) {
        res.status(500).send("Erro durante o processo de cadastro.");
    }
});

app.get('/usuario/:uid', async (req, res) => {
    const { uid } = req.params;
    var usuario = new Usuario();
    try {
        const userRecord = await usuario.buscarPorUid(uid)
        res.send(userRecord);
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).send("Erro durante o processo de busca.");
    }
});

app.put('/usuario/:uid', async (req, res) => {
    const { uid } = req.params;
    var usuario = new Usuario();
    try {
        const userRecord = await usuario.atualizar(uid, req.body)
        res.send(userRecord);
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).send("Erro durante o processo de atualização.");
    }
});

app.delete('/usuario/:uid', async (req, res) => {
    const { uid } = req.params;
    var usuario = new Usuario();
    try {
        await usuario.excluir(uid)
        // Exclua também as informações no Firestore, se necessário
        res.send(`Usuário ${uid} excluído com sucesso.`);
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        res.status(500).send("Erro durante o processo de exclusão.");
    }
});

app.get('/usuario', async (req, res) => {
    var usuario = new Usuario();
    try {
        const usuarios = await usuario.buscarTodos();
        res.send(usuarios);
    } catch (error) {
        console.error('Erro ao buscar todos os usuários:', error);
        res.status(500).send("Erro durante o processo de busca de todos os usuários.");
    }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
