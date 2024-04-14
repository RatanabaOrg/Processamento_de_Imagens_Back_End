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
        .then(async snapshot => {
          const fazendas = [];
          const userPromises = [];
          const enderecoPromises = [];
  
          snapshot.forEach(doc => {
            const fazendaData = { id: doc.id, ...doc.data() };
            fazendas.push(fazendaData);
  
            // Buscar dados do usuário
            const userPromise = db.collection('DadosUsuario').doc(fazendaData.usuarioId).get();
            userPromises.push(userPromise);
  
            // Buscar dados do endereço
            const enderecoPromise = db.collection('Endereco').doc(fazendaData.enderecoId).get()
            enderecoPromises.push(enderecoPromise);
          });
  
          const users = await Promise.all(userPromises);
          const enderecos = await Promise.all(enderecoPromises);
  
          const fazendasComUsuariosEEnderecos = fazendas.map((fazenda, index) => {
            const userData = users[index].data();
            const enderecoData = enderecos[index].data();
            return {
              ...fazenda,
              nomeUsuario: userData ? userData.nome : 'Usuário não encontrado',
              endereco: enderecoData ? enderecoData : 'Endereço não encontrado'
            };
          });
  
          resolve(fazendasComUsuariosEEnderecos);
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
            const usuarioId = dados.usuarioId; // Suponho que esse seja o campo que relaciona com o usuário
            const talhoesIds = dados.talhaoId;
            const promisesTalhoes = [];
            
            if (talhoesIds != undefined) {
              for (let f = 0; f < talhoesIds.length; f++) {
                const talhao = new Talhao();
                promisesTalhoes.push(talhao.buscarPorUidCompleto(talhoesIds[f])); // Adiciona a promessa ao array
              }
            }
  
            // Adiciona a busca de detalhes do usuário
            db.collection('DadosUsuario').doc(usuarioId).get()
              .then(userDoc => {
                const userData = userDoc.data();
                if (!userDoc.exists) {
                  dados.usuarioNome = 'Usuário não encontrado'
                } else {
                  dados.usuarioNome = userData.nome; // Adiciona o nome do usuário aos dados da fazenda
                }
                
                // Aguarda a resolução de todas as promessas dos talhões
                Promise.all(promisesTalhoes)
                  .then(talhoes => {
                    dados.talhoes = talhoes; // Adiciona a lista de talhões aos dados
                    resolve(dados);
                  })
                  .catch(error => {
                    console.error('Erro ao buscar detalhes dos talhões:', error);
                    reject('Erro ao buscar detalhes dos talhões.');
                  });
              })
              .catch(error => {
                console.error('Erro ao buscar dados do usuário:', error);
                reject('Erro ao buscar informações do usuário.');
              });
          }
        })
        .catch(error => {
          console.error('Erro ao buscar dados da fazenda:', error);
          reject('Erro ao buscar informações adicionais da fazenda.');
        });
    });
  }  

}

module.exports = {
  Fazenda: Fazenda
};
