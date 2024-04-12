const express = require('express');
const bodyParser = require('body-parser');
const { Usuario } = require('./models/usuario');
const usuario = require('./models/usuario');
const { Fazenda } = require('./models/fazenda');
const { Talhao } = require('./models/talhao');
const { Armadilha } = require('./models/armadilha');
const cors = require('cors');


const app = express();
app.use(cors()); 
app.use(bodyParser.json());


// Usuários
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

app.get('/usuario/completo/:uid', async (req, res) => {
    const { uid } = req.params;
    var usuario = new Usuario();
    try {
        const userRecord = await usuario.buscarPorUidCompleto(uid)
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



// Fazenda
app.post('/fazenda/cadastro', async (req, res) => {
    var fazenda = new Fazenda();
    try {
        var resultado = await fazenda.cadastro(req.body);
        res.send(resultado);
    } catch (error) {
        res.status(500).send("Erro durante o processo de cadastro.");
    }
});

app.get('/fazenda/:uid', async (req, res) => {
    const { uid } = req.params;
    var fazenda = new Fazenda();
    try {
        const userRecord = await fazenda.buscarPorUid(uid)
        res.send(userRecord);
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).send("Erro durante o processo de busca.");
    }
});

app.get('/fazenda/completo/:uid', async (req, res) => {
    const { uid } = req.params;
    var fazenda = new Fazenda();
    try {
        const userRecord = await fazenda.buscarPorUidCompleto(uid)
        res.send(userRecord);
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).send("Erro durante o processo de busca.");
    }
});

app.put('/fazenda/:uid', async (req, res) => {
    const { uid } = req.params;
    var fazenda = new Fazenda();
    try {
        const userRecord = await fazenda.atualizar(uid, req.body)
        res.send(userRecord);
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).send("Erro durante o processo de atualização.");
    }
});

app.delete('/fazenda/:uid', async (req, res) => {
    const { uid } = req.params;
    var fazenda = new Fazenda();
    try {
        await fazenda.excluir(uid)
        // Exclua também as informações no Firestore, se necessário
        res.send(`Usuário ${uid} excluído com sucesso.`);
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        res.status(500).send("Erro durante o processo de exclusão.");
    }
});

app.get('/fazenda', async (req, res) => {
    var fazenda = new Fazenda();
    try {
        const fazendas = await fazenda.buscarTodos();
        res.send(fazendas);
    } catch (error) {
        console.error('Erro ao buscar todos os usuários:', error);
        res.status(500).send("Erro durante o processo de busca de todos os usuários.");
    }
});



// Talhao
app.post('/talhao/cadastro', async (req, res) => {
    var talhao = new Talhao();
    try {
        var resultado = await talhao.cadastro(req.body);
        res.send(resultado);
    } catch (error) {
        res.status(500).send("Erro durante o processo de cadastro.");
    }
});

app.get('/talhao/:uid', async (req, res) => {
    const { uid } = req.params;
    var talhao = new Talhao();
    try {
        const userRecord = await talhao.buscarPorUid(uid)
        res.send(userRecord);
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).send("Erro durante o processo de busca.");
    }
});

app.get('/talhao/completo/:uid', async (req, res) => {
    const { uid } = req.params;
    var talhao = new Talhao();
    try {
        const userRecord = await talhao.buscarPorUidCompleto(uid)
        res.send(userRecord);
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).send("Erro durante o processo de busca.");
    }
});

app.put('/talhao/:uid', async (req, res) => {
    const { uid } = req.params;
    var talhao = new Talhao();
    try {
        const userRecord = await talhao.atualizar(uid, req.body)
        res.send(userRecord);
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).send("Erro durante o processo de atualização.");
    }
});

app.delete('/talhao/:uid', async (req, res) => {
    const { uid } = req.params;
    var talhao = new Talhao();
    try {
        await talhao.excluir(uid)
        // Exclua também as informações no Firestore, se necessário
        res.send(`Usuário ${uid} excluído com sucesso.`);
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        res.status(500).send("Erro durante o processo de exclusão.");
    }
});

app.get('/talhao', async (req, res) => {
    var talhao = new Talhao();
    try {
        const userRecord = await talhao.buscarTodos();
        res.send(userRecord);
    } catch (error) {
        console.error('Erro ao buscar todos os usuários:', error);
        res.status(500).send("Erro durante o processo de busca de todos os usuários.");
    }
});



// Armadilha
app.post('/armadilha/cadastro', async (req, res) => {
    var armadilha = new Armadilha();
    try {
        var resultado = await armadilha.cadastro(req.body);
        res.send(resultado);
    } catch (error) {
        res.status(500).send("Erro durante o processo de cadastro.");
    }
});

app.get('/armadilha/:uid', async (req, res) => {
    const { uid } = req.params;
    var armadilha = new Armadilha();
    try {
        const userRecord = await armadilha.buscarPorUid(uid)
        res.send(userRecord);
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).send("Erro durante o processo de busca.");
    }
});

app.put('/armadilha/:uid', async (req, res) => {
    const { uid } = req.params;
    var armadilha = new Armadilha();
    try {
        const userRecord = await armadilha.atualizar(uid, req.body)
        res.send(userRecord);
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).send("Erro durante o processo de atualização.");
    }
});

app.delete('/armadilha/:uid', async (req, res) => {
    const { uid } = req.params;
    var armadilha = new Armadilha();
    try {
        await armadilha.excluir(uid)
        // Exclua também as informações no Firestore, se necessário
        res.send(`Usuário ${uid} excluído com sucesso.`);
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        res.status(500).send("Erro durante o processo de exclusão.");
    }
});

app.get('/armadilha', async (req, res) => {
    var armadilha = new Armadilha();
    try {
        const userRecord = await armadilha.buscarTodos();
        res.send(userRecord);
    } catch (error) {
        console.error('Erro ao buscar todos os usuários:', error);
        res.status(500).send("Erro durante o processo de busca de todos os usuários.");
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    // console.log(`Servidor rodando na porta ${PORT}`);
});
