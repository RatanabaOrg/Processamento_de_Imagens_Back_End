const admin = require('firebase-admin');
const serviceAccount = require('../firebaseAdminConfig.json');

if (admin.apps.length === 0) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

class Talhao {
    cadastro(data) {
        return new Promise((resolve, reject) => {
            const { nomeTalhao, tipoPlantacao, coordenadas, fazendaId } = data;

            const db = admin.firestore();

            let talhaoId;

            db.collection('Talhao').add({
                nomeTalhao,
                tipoPlantacao,
                coordenadas,
                fazendaId
            })
                .then(talhaoDoc => {
                    talhaoId = talhaoDoc.id;

                    return db.collection('Fazenda').doc(fazendaId).update({
                        talhoes: admin.firestore.FieldValue.arrayUnion(talhaoId)
                    });
                })
                .then(() => {
                    resolve('Talhão cadastrado com sucesso.');
                })
                .catch(error => {
                    console.error('Erro ao cadastrar talhão:', error);
                    reject('Erro ao cadastrar talhão.');
                });
        });
    }

    atualizar(talhaoId, novosDados) {
        return new Promise((resolve, reject) => {
            const db = admin.firestore();

            db.collection('Talhao').doc(talhaoId).update(novosDados)
                .then(() => {
                    resolve('Talhão atualizado com sucesso.');
                })
                .catch(error => {
                    console.error('Erro ao atualizar talhão:', error);
                    reject('Erro ao atualizar talhão.');
                });
        });
    }

    buscarPorUid(talhaoId) {
        return new Promise((resolve, reject) => {
            const db = admin.firestore();

            db.collection('Talhao').doc(talhaoId).get()
                .then(talhaoDoc => {
                    if (!talhaoDoc.exists) {
                        reject('Talhão não encontrado.');
                        return;
                    }

                    resolve(talhaoDoc.data());
                })
                .catch(error => {
                    console.error('Erro ao obter detalhes do talhão:', error);
                    reject('Erro ao obter detalhes do talhão.');
                });
        });
    }

    async excluir(talhaoId) {
        return new Promise((resolve, reject) => {
            const db = admin.firestore();

            db.collection('Talhao').doc(talhaoId).delete()
                .then(() => {
                    resolve('Talhão excluído com sucesso.');
                })
                .catch(error => {
                    console.error('Erro ao excluir talhão:', error);
                    reject('Erro ao excluir talhão.');
                });
        });
    }

    async buscarTodos() {
        return new Promise((resolve, reject) => {
            const db = admin.firestore();
            db.collection('Talhao').get()
                .then(snapshot => {
                    if (snapshot.empty) {
                        resolve('Nenhum usuário encontrado.');
                        return;
                    }
                    let usuarios = [];
                    snapshot.forEach(doc => usuarios.push({ id: doc.id, ...doc.data() }));
                    resolve(usuarios);
                })
                .catch(error => {
                    console.error('Erro ao buscar todos os usuários:', error);
                    reject('Erro ao buscar usuários.');
                });
        });
    }

    // Função para obter todos os talhões de uma fazenda
    obterTodosTalhoesDaFazenda(fazendaId) {
        return new Promise((resolve, reject) => {
            const db = admin.firestore();

            db.collection('Talhao').where('fazendaId', '==', fazendaId).get()
                .then(snapshot => {
                    const talhoes = [];
                    snapshot.forEach(doc => {
                        talhoes.push({ id: doc.id, ...doc.data() });
                    });
                    resolve(talhoes);
                })
                .catch(error => {
                    console.error('Erro ao obter todos os talhões da fazenda:', error);
                    reject('Erro ao obter todos os talhões da fazenda.');
                });
        });
    }
}

module.exports = {
    Talhao: Talhao
};
