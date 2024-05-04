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
      const { nomeFazenda, coordenadaSede, usuarioId } = data;

      const db = admin.firestore();

      db.collection('Fazenda').add({
        nomeFazenda,
        coordenadaSede,
        usuarioId
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
      const {
        coordenadaSede,
        usuarioId,
        nomeFazenda
      } = novosDados;

      // Atualizando informações na coleção Fazenda
      db.collection('Fazenda').doc(fazendaId).update({
        coordenadaSede,
        usuarioId,
        nomeFazenda
      }).then(() => {
        resolve('Fazenda e endereço atualizados com sucesso.');
      }).catch(error => {
        console.error('Erro ao atualizar dados da fazenda:', error);
        reject('Erro ao atualizar dados da fazenda.');
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

  async buscarPorUidCompleto(fazendaId) {
    try {
      const db = admin.firestore();

      // Obtenha os detalhes da fazenda
      const doc = await db.collection('Fazenda').doc(fazendaId).get();
      if (!doc.exists) {
        throw new Error('Nenhum dado encontrado.');
      }
      const dados = doc.data();

      // Busca detalhes dos talhões, se disponíveis
      const promisesTalhoes = dados.talhaoId ? dados.talhaoId.map(id => new Talhao().buscarPorUidCompleto(id)) : [];
      dados.talhoes = await Promise.all(promisesTalhoes);

      // Busca detalhes do usuário associado
      const usuarioDoc = await db.collection('DadosUsuario').doc(dados.usuarioId).get();
      if (!usuarioDoc.exists) {
        throw new Error('Usuário não encontrado.');
      }
      dados.nomeUsuario = usuarioDoc.data().nome;

      dados.id = fazendaId

      return dados;
    } catch (error) {
      console.error('Erro durante a busca de dados da fazenda:', error);
      throw error;
    }
  }
}

module.exports = {
  Fazenda: Fazenda
};
