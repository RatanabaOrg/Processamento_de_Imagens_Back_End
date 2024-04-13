const admin = require('firebase-admin');
const serviceAccount = require('../firebaseAdminConfig.json');
const { Talhao } = require('./talhao');

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

class Fazenda {

  cadastro(data) {
    return new Promise((resolve, reject) => {
      const { nomeFazenda, coordenadaSede, endereco, usuarioId } = data;

      const db = admin.firestore();

      let enderecoId;
      let fazendaId;

      db.collection('Endereco').add(endereco)
        .then(addressDoc => {
          enderecoId = addressDoc.id;

          return db.collection('Fazenda').add({
            nomeFazenda,
            coordenadaSede,
            enderecoId,
            usuarioId
          });
        })
        .then(fazendaDoc => {
          fazendaId = fazendaDoc.id;

          return db.collection('DadosUsuario').doc(usuarioId).update({
            fazendaId: admin.firestore.FieldValue.arrayUnion(fazendaId)
          });
        })
        .then(() => {
          resolve('Fazenda cadastrada com sucesso.');
        })
        .catch(error => {
          console.error('Erro ao cadastrar fazenda:', error);
          reject('Erro ao cadastrar fazenda.');
        });
    });
  }

  atualizar(fazendaId, novosDados) {
    return new Promise((resolve, reject) => {
      const db = admin.firestore();

      db.collection('Fazenda').doc(fazendaId).update(novosDados)
        .then(() => {
          resolve('Fazenda atualizada com sucesso.');
        })
        .catch(error => {
          console.error('Erro ao atualizar fazenda:', error);
          reject('Erro ao atualizar fazenda.');
        });
    });
  }

  buscarPorUid(fazendaId) {
    return new Promise((resolve, reject) => {
      const db = admin.firestore();

      db.collection('Fazenda').doc(fazendaId).get()
        .then(fazendaDoc => {
          if (!fazendaDoc.exists) {
            reject('Fazenda não encontrada.');
            return;
          }

          resolve(fazendaDoc.data());
        })
        .catch(error => {
          console.error('Erro ao obter detalhes da fazenda:', error);
          reject('Erro ao obter detalhes da fazenda.');
        });
    });
  }

  excluir(fazendaId) {
    return new Promise((resolve, reject) => {
      const db = admin.firestore();

      db.collection('Fazenda').doc(fazendaId).delete()
        .then(() => {
          resolve('Fazenda excluída com sucesso.');
        })
        .catch(error => {
          console.error('Erro ao excluir fazenda:', error);
          reject('Erro ao excluir fazenda.');
        });
    });
  }

  buscarTodos() {
    return new Promise((resolve, reject) => {
      const db = admin.firestore();

      db.collection('Fazenda').get()
        .then(snapshot => {
          const fazendas = [];
          snapshot.forEach(doc => {
            fazendas.push({ id: doc.id, ...doc.data() });
          });
          resolve(fazendas);
        })
        .catch(error => {
          console.error('Erro ao obter todas as fazendas:', error);
          reject('Erro ao obter todas as fazendas.');
        });
    });
  }

  buscarPorUidCompleto(fazendaId) {
    return new Promise((resolve, reject) => {
      const db = admin.firestore();

      let fazenda = {};

      // Primeiro, obtenha os detalhes da fazenda
      db.collection('Fazenda').doc(fazendaId).get()
        .then(doc => {
          if (!doc.exists) {
            reject('Nenhum dado encontrado.');
          } else {
            const dados = doc.data();
            const talhoesIds = dados.talhaoId;
            const promisesTalhoes = []; // Array para armazenar as promessas de busca das fazendas
            if (talhoesIds.length > 0) {
              for (let f = 0; f < talhoesIds.length; f++) {
                const talhao = new Talhao();
                promisesTalhoes.push(talhao.buscarPorUidCompleto(talhoesIds[f])); // Adiciona a promessa ao array
              }
            }
            // Aguarda a resolução de todas as promessas
            Promise.all(promisesTalhoes)
              .then(talhoes => {
                dados.talhoes = talhoes; // Adiciona a lista de fazendas aos dados
                resolve(dados);
              })
              .catch(error => {
                console.error('Erro ao buscar detalhes das fazendas:', error);
                reject('Erro ao buscar detalhes das fazendas.');
              });
          }
        })
        .catch(error => {
          console.error('Erro ao buscar dados adicionais:', error);
          reject('Erro ao buscar informações adicionais do usuário.');
        });
    });
  }

}

module.exports = {
  Fazenda: Fazenda
};
