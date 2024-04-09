const admin = require('firebase-admin');
const serviceAccount = require('../firebaseAdminConfig.json');

if (admin.apps.length === 0) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

class Armadilha {
    cadastro(data) {
        return new Promise((resolve, reject) => {
            const { nomeArmadilha, coordenadas, talhaoId } = data;

            const db = admin.firestore();

            let armadilhaId;

            db.collection('Armadilha').add({ nomeArmadilha, coordenadas, talhaoId })
                .then(armadilhaDoc => {
                    armadilhaId = armadilhaDoc.id;

                    // Atualize o documento do talhão para incluir o ID da armadilha
                    return db.collection('Talhao').doc(talhaoId).update({
                        armadilhaId: admin.firestore.FieldValue.arrayUnion(armadilhaId)
                    });
                })
                .then(() => {
                    resolve('Armadilha cadastrada com sucesso.');
                })
                .catch(error => {
                    console.error('Erro ao cadastrar armadilha:', error);
                    reject('Erro ao cadastrar armadilha.');
                });
        });
    }

    // Função para atualizar os detalhes da armadilha
    atualizar(armadilhaId, novosDados) {
        return new Promise((resolve, reject) => {
            const db = admin.firestore();

            db.collection('Armadilha').doc(armadilhaId).update(novosDados)
                .then(() => {
                    resolve('Armadilha atualizada com sucesso.');
                })
                .catch(error => {
                    console.error('Erro ao atualizar armadilha:', error);
                    reject('Erro ao atualizar armadilha.');
                });
        });
    }

    // Função para obter os detalhes da armadilha
    buscarPorUid(armadilhaId) {
        return new Promise((resolve, reject) => {
            const db = admin.firestore();

            db.collection('Armadilha').doc(armadilhaId).get()
                .then(armadilhaDoc => {
                    if (!armadilhaDoc.exists) {
                        reject('Armadilha não encontrada.');
                        return;
                    }

                    resolve(armadilhaDoc.data());
                })
                .catch(error => {
                    console.error('Erro ao obter detalhes da armadilha:', error);
                    reject('Erro ao obter detalhes da armadilha.');
                });
        });
    }

    // Função para excluir uma armadilha
    excluir(armadilhaId) {
        return new Promise((resolve, reject) => {
            const db = admin.firestore();

            db.collection('Armadilha').doc(armadilhaId).delete()
                .then(() => {
                    resolve('Armadilha excluída com sucesso.');
                })
                .catch(error => {
                    console.error('Erro ao excluir armadilha:', error);
                    reject('Erro ao excluir armadilha.');
                });
        });
    }

    // Função para obter todas as armadilhas
    buscarTodos() {
        return new Promise((resolve, reject) => {
            const db = admin.firestore();
            db.collection('Armadilha').get()
                .then(snapshot => {
                    if (snapshot.empty) {
                        resolve('Nenhuma armadilha encontrada.');
                        return;
                    }
                    let armadilhas = [];
                    snapshot.forEach(doc => armadilhas.push({ id: doc.id, ...doc.data() }));
                    resolve(armadilhas);
                })
                .catch(error => {
                    console.error('Erro ao buscar todas as armadilhas:', error);
                    reject('Erro ao buscar armadilhas.');
                });
        });
    }

}

module.exports = {
    Armadilha: Armadilha
};
