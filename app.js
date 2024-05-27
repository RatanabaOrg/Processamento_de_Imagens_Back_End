const express = require('express');
const multer = require('multer'); 

const bodyParser = require('body-parser');
const { Usuario } = require('./models/usuario');
const usuario = require('./models/usuario');
const { Fazenda } = require('./models/fazenda');
const { Talhao } = require('./models/talhao');
const { Armadilha } = require('./models/armadilha');
const cors = require('cors');
const { Verificacao } = require('./models/verificacao');


const app = express();
const upload = multer()
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

    const authHeader = req.headers.authorization
    var verificacao = new Verificacao()
    const tokenUid = await verificacao.verificarToken(authHeader.split(' ')[1]);

    if (tokenUid != false) {
        if (tokenUid == uid) {
            var usuario = new Usuario();
            try {
                const userRecord = await usuario.buscarPorUid(uid)
                res.send(userRecord);
            } catch (error) {
                res.status(500).send("Erro durante o processo de busca.");
            }
        } else if (tokenUid == "adm") {
            var usuario = new Usuario();
            try {
                const userRecord = await usuario.buscarPorUid(uid)
                res.send(userRecord);
            } catch (error) {
                res.status(500).send("Erro durante o processo de busca.");
            }
        } else {
            res.status(500).send("Sem permissão");
        }

    } else {
        res.status(500).send("Nenhum token fornecido.");
    }
});

app.get('/usuario/completo/:uid', async (req, res) => {
    const { uid } = req.params;

    const authHeader = req.headers.authorization
    var verificacao = new Verificacao()
    const tokenUid = await verificacao.verificarToken(authHeader.split(' ')[1]);

    if (tokenUid != false) {
        if (tokenUid == uid) {
            var usuario = new Usuario();
            try {
                const userRecord = await usuario.buscarPorUidCompleto(uid)
                res.send(userRecord);
            } catch (error) {
                console.error('Erro ao buscar usuário:', error);
                res.status(500).send("Erro durante o processo de busca.");
            }
        } else if (tokenUid == "adm") {
            var usuario = new Usuario();
            try {
                const userRecord = await usuario.buscarPorUidCompleto(uid)
                res.send(userRecord);
            } catch (error) {
                console.error('Erro ao buscar usuário:', error);
                res.status(500).send("Erro durante o processo de busca.");
            }
        } else {
            res.status(500).send("Sem permissão");
        }

    } else {
        res.status(500).send("Nenhum token fornecido.");
    }
});

app.put('/usuario/:uid', async (req, res) => {
    const { uid } = req.params;

    const authHeader = req.headers.authorization
    var verificacao = new Verificacao()
    const tokenUid = await verificacao.verificarToken(authHeader.split(' ')[1]);

    if (tokenUid != false) {
        if (tokenUid == uid) {
            var usuario = new Usuario();
            try {
                const userRecord = await usuario.atualizar(uid, req.body)
                res.send(userRecord);
            } catch (error) {
                console.error('Erro ao atualizar usuário:', error);
                res.status(500).send("Erro durante o processo de atualização.");
            }
        } else if (tokenUid == "adm") {
            var usuario = new Usuario();
            try {
                const userRecord = await usuario.atualizar(uid, req.body)
                res.send(userRecord);
            } catch (error) {
                console.error('Erro ao atualizar usuário:', error);
                res.status(500).send("Erro durante o processo de atualização.");
            }
        } else {
            res.status(500).send("Sem permissão");
        }

    } else {
        res.status(500).send("Nenhum token fornecido.");
    }
});

app.delete('/usuario/:uid', async (req, res) => {
    const { uid } = req.params;

    const authHeader = req.headers.authorization
    var verificacao = new Verificacao()
    const tokenUid = await verificacao.verificarToken(authHeader.split(' ')[1]);

    if (tokenUid != false) {
        if (tokenUid == uid) {
            var usuario = new Usuario();
            try {
                await usuario.excluir(uid)
                // Exclua também as informações no Firestore, se necessário
                res.send(`Usuário ${uid} excluído com sucesso.`);
            } catch (error) {
                console.error('Erro ao excluir usuário:', error);
                res.status(500).send("Erro durante o processo de exclusão.");
            }
        } else if (tokenUid == "adm") {
            var usuario = new Usuario();
            try {
                await usuario.excluir(uid)
                // Exclua também as informações no Firestore, se necessário
                res.send(`Usuário ${uid} excluído com sucesso.`);
            } catch (error) {
                console.error('Erro ao excluir usuário:', error);
                res.status(500).send("Erro durante o processo de exclusão.");
            }
        } else {
            res.status(500).send("Sem permissão");
        }

    } else {
        res.status(500).send("Nenhum token fornecido.");
    }
});

app.get('/usuario', async (req, res) => {

    const authHeader = req.headers.authorization
    var verificacao = new Verificacao()
    const tokenUid = await verificacao.verificarToken(authHeader.split(' ')[1]);

    if (tokenUid != false) {
        if (tokenUid == "adm") {
            var usuario = new Usuario();
            try {
                const usuarios = await usuario.buscarTodos();
                res.send(usuarios);
            } catch (error) {
                console.error('Erro ao buscar todos os usuários:', error);
                res.status(500).send("Erro durante o processo de busca de todos os usuários.");
            }
        } else {
            res.status(500).send("Sem permissão");
        }

    } else {
        res.status(500).send("Nenhum token fornecido.");
    }
});



// Fazenda
app.post('/fazenda/cadastro', async (req, res) => {
    var fazenda = new Fazenda();
    const authHeader = req.headers.authorization
    var verificacao = new Verificacao()
    const tokenUid = await verificacao.verificarToken(authHeader.split(' ')[1]);

    if (tokenUid != false) {
        try {
            if (req.body.geojson) {
                const geojson = req.body.geojson
                const idAgricultor = req.body.usuarioId
                const nomeFazenda = geojson.features.properties.FAZENDA
                const coordenadas = geojson.features.geometry.coordinates[0]
                const coordenadaSede = coordenadas.map(coordenada => ({ latitude: coordenada[0], longitude: coordenada[1] }));
                var resultado = await fazenda.cadastro({nomeFazenda: nomeFazenda, coordenadaSede: coordenadaSede, usuarioId: idAgricultor});
            } else {
                var resultado = await fazenda.cadastro(req.body);
            }
            
            res.send(resultado);
        } catch (error) {
            res.status(500).send("Erro durante o processo de cadastro.");
        }
    } else {
        res.status(500).send("Nenhum token fornecido.");
    }
});

app.get('/fazenda/:uid', async (req, res) => {
    const { uid } = req.params;
    var fazenda = new Fazenda();

    const authHeader = req.headers.authorization
    var verificacao = new Verificacao()
    const tokenUid = await verificacao.verificarToken(authHeader.split(' ')[1]);

    if (tokenUid != false) {
        try {
            const userRecord = await fazenda.buscarPorUid(uid)
            res.send(userRecord);
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            res.status(500).send("Erro durante o processo de busca.");
        }
    } else {
        res.status(500).send("Nenhum token fornecido.");
    }

});

app.get('/fazenda/completo/:uid', async (req, res) => {
    const { uid } = req.params;
    var fazenda = new Fazenda();

    const authHeader = req.headers.authorization
    var verificacao = new Verificacao()
    const tokenUid = await verificacao.verificarToken(authHeader.split(' ')[1]);

    if (tokenUid != false) {
        try {
            const userRecord = await fazenda.buscarPorUidCompleto(uid)
            res.send(userRecord);
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            res.status(500).send("Erro durante o processo de busca.");
        }
    } else {
        res.status(500).send("Nenhum token fornecido.");
    }
});

app.put('/fazenda/:uid', async (req, res) => {
    const { uid } = req.params;
    var fazenda = new Fazenda();

    const authHeader = req.headers.authorization
    var verificacao = new Verificacao()
    const tokenUid = await verificacao.verificarToken(authHeader.split(' ')[1]);

    if (tokenUid != false) {
        try {
            const userRecord = await fazenda.atualizar(uid, req.body)
            res.send(userRecord);
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            res.status(500).send("Erro durante o processo de atualização.");
        }
    } else {
        res.status(500).send("Nenhum token fornecido.");
    }
});

app.delete('/fazenda/:uid', async (req, res) => {
    const { uid } = req.params;
    var fazenda = new Fazenda();

    const authHeader = req.headers.authorization
    var verificacao = new Verificacao()
    const tokenUid = await verificacao.verificarToken(authHeader.split(' ')[1]);

    if (tokenUid != false) {
        try {
            await fazenda.excluir(uid)
            // Exclua também as informações no Firestore, se necessário
            res.send(`Usuário ${uid} excluído com sucesso.`);
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            res.status(500).send("Erro durante o processo de exclusão.");
        }
    } else {
        res.status(500).send("Nenhum token fornecido.");
    }
});

app.get('/fazenda', async (req, res) => {
    var fazenda = new Fazenda();

    const authHeader = req.headers.authorization
    var verificacao = new Verificacao()
    const tokenUid = await verificacao.verificarToken(authHeader.split(' ')[1]);

    if (tokenUid != false) {
        if (tokenUid == "adm") {
            try {
                const fazendas = await fazenda.buscarTodos();
                res.send(fazendas);
            } catch (error) {
                console.error('Erro ao buscar todos os usuários:', error);
                res.status(500).send("Erro durante o processo de busca de todos os usuários.");
            }
        } else {
            res.status(500).send("Sem permissão.");
        }
    } else {
        res.status(500).send("Nenhum token fornecido.");
    }

});



// Talhao
app.post('/talhao/cadastro', async (req, res) => {
    var talhao = new Talhao();
    const authHeader = req.headers.authorization
    var verificacao = new Verificacao()
    const tokenUid = await verificacao.verificarToken(authHeader.split(' ')[1]);

    if (tokenUid != false) {
        try {
            if (req.body.geoJson) {
                const geojson = req.body.geoJson
                const idFazenda = req.body.fazendaId
                const nomeTalhao = geojson.features.properties.NAME
                const tipoPlantacao = geojson.features.properties.tipoPlantacao
                const coordenadas = geojson.features.geometry.coordinates[0]
                const coordenadasFormatadas = coordenadas.map(coordenada => ({ latitude: coordenada[0], longitude: coordenada[1] }));
                var resultado = await talhao.cadastro({nomeTalhao: nomeTalhao, tipoPlantacao: tipoPlantacao, coordenadas: coordenadasFormatadas, fazendaId: idFazenda});
            } else {
                var resultado = await talhao.cadastro(req.body);
            }
            res.send(resultado);
        } catch (error) {
            res.status(500).send("Erro durante o processo de cadastro.");
        }
    } else {
        res.status(500).send("Nenhum token fornecido.");
    }

});

app.get('/talhao/:uid', async (req, res) => {
    const { uid } = req.params;
    var talhao = new Talhao();

    const authHeader = req.headers.authorization
    var verificacao = new Verificacao()
    const tokenUid = await verificacao.verificarToken(authHeader.split(' ')[1]);

    if (tokenUid != false) {
        try {
            const userRecord = await talhao.buscarPorUid(uid)
            res.send(userRecord);
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            res.status(500).send("Erro durante o processo de busca.");
        }
    } else {
        res.status(500).send("Nenhum token fornecido.");
    }
});

app.get('/talhao/completo/:uid', async (req, res) => {
    const { uid } = req.params;
    var talhao = new Talhao();

    const authHeader = req.headers.authorization
    var verificacao = new Verificacao()
    const tokenUid = await verificacao.verificarToken(authHeader.split(' ')[1]);

    if (tokenUid != false) {
        try {
            const userRecord = await talhao.buscarPorUidCompleto(uid)
            res.send(userRecord);
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            res.status(500).send("Erro durante o processo de busca.");
        }
    } else {
        res.status(500).send("Nenhum token fornecido.");
    }
});

app.put('/talhao/:uid', async (req, res) => {
    const { uid } = req.params;
    var talhao = new Talhao();

    const authHeader = req.headers.authorization
    var verificacao = new Verificacao()
    const tokenUid = await verificacao.verificarToken(authHeader.split(' ')[1]);

    if (tokenUid != false) {
        try {
            const userRecord = await talhao.atualizar(uid, req.body)
            res.send(userRecord);
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            res.status(500).send("Erro durante o processo de atualização.");
        }
    } else {
        res.status(500).send("Nenhum token fornecido.");
    }
});

app.delete('/talhao/:uid', async (req, res) => {
    const { uid } = req.params;
    var talhao = new Talhao();

    const authHeader = req.headers.authorization
    var verificacao = new Verificacao()
    const tokenUid = await verificacao.verificarToken(authHeader.split(' ')[1]);

    if (tokenUid != false) {
        try {
            await talhao.excluir(uid)
            // Exclua também as informações no Firestore, se necessário
            res.send(`Usuário ${uid} excluído com sucesso.`);
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            res.status(500).send("Erro durante o processo de exclusão.");
        }
    } else {
        res.status(500).send("Nenhum token fornecido.");
    }
});

app.get('/talhao', async (req, res) => {
    var talhao = new Talhao();

    const authHeader = req.headers.authorization
    var verificacao = new Verificacao()
    const tokenUid = await verificacao.verificarToken(authHeader.split(' ')[1]);

    if (tokenUid != false) {
        if (tokenUid == "adm") {
            try {
                const userRecord = await talhao.buscarTodos();
                res.send(userRecord);
            } catch (error) {
                console.error('Erro ao buscar todos os usuários:', error);
                res.status(500).send("Erro durante o processo de busca de todos os usuários.");
            }
        } else {
            res.status(500).send("Sem permissão.");
        }
    } else {
        res.status(500).send("Nenhum token fornecido.");
    }
});



// Armadilha
app.post('/armadilha/cadastro', async (req, res) => {
    var armadilha = new Armadilha();
    const authHeader = req.headers.authorization
    var verificacao = new Verificacao()
    const tokenUid = await verificacao.verificarToken(authHeader.split(' ')[1]);

    if (tokenUid != false) {
        try {
            if (req.body.geoJson) {
                const geojson = req.body.geoJson
                const idTalhao = req.body.talhaoId
                const nomeArmadilha = geojson.features.properties.NAME
                const coordenadas = geojson.features.geometry.coordinates
                const coordenadasFormatadas = { latitude: coordenadas[0], longitude: coordenadas[1] };
                var resultado = await armadilha.cadastro({nomeArmadilha: nomeArmadilha, coordenada: coordenadasFormatadas, talhaoId: idTalhao});
            } else {
                var resultado = await armadilha.cadastro(req.body);
            }
            res.send(resultado);
        } catch (error) {
            res.status(500).send("Erro durante o processo de cadastro.");
        }
    } else {
        res.status(500).send("Nenhum token fornecido.");
    }
});

app.get('/armadilha/:uid', async (req, res) => {
    const { uid } = req.params;
    var armadilha = new Armadilha();

    const authHeader = req.headers.authorization
    var verificacao = new Verificacao()
    const tokenUid = await verificacao.verificarToken(authHeader.split(' ')[1]);

    if (tokenUid != false) {
        try {
            const userRecord = await armadilha.buscarPorUid(uid)
            res.send(userRecord);
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            res.status(500).send("Erro durante o processo de busca.");
        }
    } else {
        res.status(500).send("Nenhum token fornecido.");
    }
});

app.put('/armadilha/:uid', async (req, res) => {
    const { uid } = req.params;
    var armadilha = new Armadilha();

    const authHeader = req.headers.authorization
    var verificacao = new Verificacao()
    const tokenUid = await verificacao.verificarToken(authHeader.split(' ')[1]);

    if (tokenUid != false) {
        try {
            const userRecord = await armadilha.atualizar(uid, req.body)
            res.send(userRecord);
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            res.status(500).send("Erro durante o processo de atualização.");
        }
    } else {
        res.status(500).send("Nenhum token fornecido.");
    }
});

app.delete('/armadilha/:uid', async (req, res) => {
    const { uid } = req.params;
    var armadilha = new Armadilha();

    const authHeader = req.headers.authorization
    var verificacao = new Verificacao()
    const tokenUid = await verificacao.verificarToken(authHeader.split(' ')[1]);

    if (tokenUid != false) {
        try {
            await armadilha.excluir(uid)
            // Exclua também as informações no Firestore, se necessário
            res.send(`Usuário ${uid} excluído com sucesso.`);
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            res.status(500).send("Erro durante o processo de exclusão.");
        }
    } else {
        res.status(500).send("Nenhum token fornecido.");
    }
});

app.get('/armadilha', async (req, res) => {
    var armadilha = new Armadilha();

    const authHeader = req.headers.authorization
    var verificacao = new Verificacao()
    const tokenUid = await verificacao.verificarToken(authHeader.split(' ')[1]);

    if (tokenUid != false) {
        if (tokenUid == "adm") {
            try {
                const userRecord = await armadilha.buscarTodos();
                res.send(userRecord);
            } catch (error) {
                console.error('Erro ao buscar todos os usuários:', error);
                res.status(500).send("Erro durante o processo de busca de todos os usuários.");
            }
        } else {
            res.status(500).send("Sem permissão.");
        }
    } else {
        res.status(500).send("Nenhum token fornecido.");
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`==> Servidor rodando na porta http://localhost:${PORT}      :)`);
});
