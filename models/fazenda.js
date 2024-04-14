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

      // Primeiro, exclua a armadilha.
      db.collection('Fazenda').doc(fazendaId).delete()
        .then(() => {
          // Busca todos os talhões que contêm o ID da armadilha em seu array.
          return db.collection('DadosUsuario').where('fazendaId', 'array-contains', fazendaId).get();
        })
        .then(querySnapshot => {
          // Cria uma lista de promessas para atualizar cada talhão.
          const updatePromises = [];
          querySnapshot.forEach(doc => {
            // Remove o ID da armadilha do array 'armadilhaId'.
            const updatedFazendaIds = doc.data().fazendaId.filter(id => id !== fazendaId);
            updatePromises.push(doc.ref.update({ fazendaId: updatedFazendaIds }));
          });
          // Espera todas as atualizações serem concluídas.
          return Promise.all(updatePromises);
        })
        .then(() => {
          resolve('Armadilha excluída com sucesso e referências atualizadas.');
        })
        .catch(error => {
          console.error('Erro ao excluir armadilha ou atualizar talhões:', error);
          reject('Erro ao excluir armadilha ou atualizar talhões.');
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

      // Primeiro, obtenha os detalhes da fazenda
      db.collection('Fazenda').doc(fazendaId).get()
        .then(doc => {
          if (!doc.exists) {
            reject('Nenhum dado encontrado.');
          } else {
            const dados = doc.data();
            const talhoesIds = dados.talhaoId;
            const promisesTalhoes = [];
            if (talhoesIds != undefined) {
              for (let f = 0; f < talhoesIds.length; f++) {
                const talhao = new Talhao();
                promisesTalhoes.push(talhao.buscarPorUidCompleto(talhoesIds[f]));
              }
            }

            db.collection('DadosUsuario').doc(dados.usuarioId).get()
              .then(usuarioDoc => {
                if (!usuarioDoc.exists) {
                  reject('usuario não encontrada.');
                  return;
                }
                dados.nomeUsuario = usuarioDoc.data().nome
              })
              .catch(error => {
                console.error('Erro ao obter detalhes da usuario:', error);
                reject('Erro ao obter detalhes da usuario.');
              });


            db.collection('Endereco').doc(dados.enderecoId).get()
              .then(enderecoDoc => {
                if (!enderecoDoc.exists) {
                  reject('endereco não encontrada.');
                  return;
                }
                dados.endereco = enderecoDoc.data()
              })
              .catch(error => {
                console.error('Erro ao obter detalhes da endereco:', error);
                reject('Erro ao obter detalhes da endereco.');
              });

            Promise.all(promisesTalhoes)
              .then(talhoes => {
                dados.talhoes = talhoes;
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
