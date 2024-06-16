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
                var resultado = await fazenda.cadastro({ nomeFazenda: nomeFazenda, coordenadaSede: coordenadaSede, usuarioId: idAgricultor });
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
                var resultado = await talhao.cadastro({ nomeTalhao: nomeTalhao, tipoPlantacao: tipoPlantacao, coordenadas: coordenadasFormatadas, fazendaId: idFazenda });
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
                var resultado = await armadilha.cadastro({ nomeArmadilha: nomeArmadilha, coordenada: coordenadasFormatadas, talhaoId: idTalhao });
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

app.get('/armadilha/:uid/:number', async (req, res) => {
    const { uid, number } = req.params;
    var armadilha = new Armadilha();

    const authHeader = req.headers.authorization
    var verificacao = new Verificacao()
    const tokenUid = await verificacao.verificarToken(authHeader.split(' ')[1]);

    if (tokenUid != false) {
        try {
            const userRecord = await armadilha.buscarPorUid(uid)
            const dados = userRecord.pragas

            let novaLista = [];
            if (Array.isArray(dados) && dados.length > 0 && typeof dados[0] === 'object') {
                if (number == 0) {
                    novaLista.push(dados[0]);
                    for (let i = 1; i < dados.length; i++) {
                        if (dados[i].data.substring(3, 5) === dados[i - 1].data.substring(3, 5)) {
                            novaLista[i - 1].quantidade += dados[i].quantidade;
                        } else {
                            novaLista.push(dados[i]);
                        }
                    }

                    function formatarData(data) {
                        const [dia, mes, ano] = data.split('/');
                        const mesesAbreviados = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
                        const mesAbreviado = mesesAbreviados[parseInt(mes) - 1];
                        const anoAbreviado = ano.slice(-2);
                        return `${mesAbreviado}/${anoAbreviado}`;
                    }

                    for (let i of novaLista) {
                        i.data = formatarData(i.data)
                    }
                } else {
                    function getDaysInMonth(month, year) {
                        return new Date(year, month, 0).getDate();
                    }

                    var diasComDados = {};


                    for (var i = 0; i < dados.length; i++) {
                        var partesData = dados[i].data.split('/');
                        var dia = parseInt(partesData[0], 10);
                        var mes = parseInt(partesData[1], 10);
                        var anoData = parseInt(partesData[2], 10);

                        if (mes == number) {
                            if (!diasComDados[anoData]) {
                                diasComDados[anoData] = {};
                            }
                            diasComDados[anoData][dia] = dados[i];
                        }
                    }

                    for (var ano in diasComDados) {
                        var numeroDias = getDaysInMonth(number, ano);
                        for (var dia = 1; dia <= numeroDias; dia++) {
                            var diaFormatado = dia.toString().padStart(2, '0');
                            var mesFormatado = number.toString().padStart(2, '0');
                            if (diasComDados[ano][dia]) {
                                    novaLista.push({
                                        data: `${diaFormatado}/${mesFormatado}`,
                                        quantidade: diasComDados[ano][dia].quantidade
                                    })
                               
                            } else {
                                var diaFormatado = dia.toString().padStart(2, '0');
                                var mesFormatado = number.toString().padStart(2, '0');
                                novaLista.push({
                                    data: `${diaFormatado}/${mesFormatado}`,
                                    quantidade: 0
                                });
                            }
                        }
                    }
                }

                const data = {
                    labels: novaLista.map(item => item.data),
                    datasets: [
                        {
                            data: novaLista.map(item => item.quantidade)
                        }
                    ]
                };
            
            res.send(data);
            } else {
                res.send({})
            }
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            res.status(500).send("Erro durante o processo de busca.");
        }
    } else {
        res.status(500).send("Nenhum token fornecido.");
    }
});

app.get('/armadilha/:uid/media/:number', async (req, res) => {
    const { uid, number } = req.params;
    var armadilha = new Armadilha();

    const authHeader = req.headers.authorization
    var verificacao = new Verificacao()
    const tokenUid = await verificacao.verificarToken(authHeader.split(' ')[1]);

    if (tokenUid != false) {
        try {
            const userRecord = await armadilha.buscarPorUid(uid)
            const dados = userRecord.pragas
            if (Array.isArray(dados) && dados.length > 0 && typeof dados[0] === 'object') {
            if (number == 0) {
                const mesesComDados = new Set(dados.map(item => new Date(item.data).getMonth() + 1)).size;
                const totalQuantidades = dados.reduce((acc, item) => acc + item.quantidade, 0);
                media = totalQuantidades / 12;
            } else {
                function contarDiasNoMes(mes) {
                    const dataAtual = new Date();
                    return new Date(dataAtual.getFullYear(), mes, 0).getDate();
                }
                const dadosFiltrados = dados.filter(item => new Date(item.data.split('/').reverse().join('-')).getMonth() + 1 == number);
                const totalQuantidades = dadosFiltrados.reduce((acc, item) => acc + item.quantidade, 0);
                const diasNoMes = contarDiasNoMes(number);
                console.log(diasNoMes)
                media = totalQuantidades / diasNoMes;
                console.log(media)
            }
            const mediaFormatada = parseFloat(media.toFixed(2));
            res.send({ mediaFormatada });
        } else {
            res.send({})
        }
            
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            res.status(500).send("Erro durante o processo de busca.");
        }
    } else {
        res.status(500).send("Nenhum token fornecido.");
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`==> Servidor rodando na porta http://localhost:${PORT}      :)`);
});
