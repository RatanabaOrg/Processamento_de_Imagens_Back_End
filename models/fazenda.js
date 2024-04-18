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
      const {
        coordenadaSede,
        enderecoId,
        usuarioId,
        uf,
        cidade,
        complemento,
        numero,
        bairro,
        logradouro,
        cep,
        nomeFazenda
      } = novosDados;
  
      // Atualizando informações na coleção Fazenda
      db.collection('Fazenda').doc(fazendaId).update({
        coordenadaSede,
        enderecoId,
        usuarioId,
        nomeFazenda
      }).then(() => {
        // Atualizando informações de endereço na coleção Endereco
        db.collection('Endereco').doc(enderecoId).update({
          uf,
          cidade,
          complemento,
          numero,
          bairro,
          logradouro,
          cep
        }).then(() => {
          resolve('Fazenda e endereço atualizados com sucesso.');
        }).catch(error => {
          console.error('Erro ao atualizar endereço:', error);
          reject('Erro ao atualizar endereço da fazenda.');
        });
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
  
      // Busca detalhes do endereço
      const enderecoDoc = await db.collection('Endereco').doc(dados.enderecoId).get();
      if (!enderecoDoc.exists) {
        throw new Error('Endereço não encontrado.');
      }
      dados.endereco = enderecoDoc.data();
  
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
