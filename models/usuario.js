const admin = require('firebase-admin');
const serviceAccount = require('../firebaseAdminConfig.json');
const { Fazenda } = require('./fazenda');

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

class Usuario {
  cadastro(data) {
    return new Promise((resolve, reject) => {
      const { nome, email, senha, confirmarSenha, telefone, endereco } = data;

      if (senha !== confirmarSenha) {
        reject('As senhas não coincidem.');
        return;
      }

      admin.auth().createUser({
        email,
        password: senha,
      })
        .then(userRecord => {
          const userId = userRecord.uid;
          const db = admin.firestore();

          // Primeiro, crie um documento para o endereço
          db.collection('Endereco').add(endereco)
            .then(addressDoc => {
              const enderecoId = addressDoc.id;

              // Em seguida, adicione o ID do endereço ao documento do usuário
              return db.collection('DadosUsuario').doc(userId).set({
                nome,
                telefone,
                enderecoId,
                cliente: true
              });
            })
            .then(() => {
              resolve('Usuário cadastrado com sucesso.');
            })
            .catch(error => {
              console.error('Erro ao salvar dados adicionais:', error);
              reject('Erro ao salvar informações adicionais do usuário.');
            });
        })
        .catch(error => {
          console.error('Erro ao criar usuário:', error);
          reject('Erro ao cadastrar usuário.');
        });
    });
  }

  async buscarPorUid(uid) {
    return new Promise((resolve, reject) => {
      admin.auth().getUser(uid)
        .then(userRecord => {
          const userEmail = userRecord.email; // Acessa o email do registro de autenticação
          const db = admin.firestore();
          db.collection('DadosUsuario').doc(uid).get()
            .then(doc => {
              if (!doc.exists) {
                reject('Nenhum dado encontrado.');
              } else {
                const userData = doc.data();
                resolve({
                  ...userData,  // Incorpora os dados existentes do Firestore
                  email: userEmail  // Adiciona o email ao objeto retornado
                });
              }
            })
            .catch(error => {
              console.error('Erro ao buscar dados adicionais:', error);
              reject('Erro ao buscar informações adicionais do usuário.');
            });
        })
        .catch(error => {
          console.error('Erro ao buscar usuário:', error);
          reject('Usuário não encontrado.');
        });
    });
  }

  async atualizar(uid, data) {
    return new Promise((resolve, reject) => {
      admin.auth().updateUser(uid, data)
        .then(() => {
          const db = admin.firestore();
          const { cep, logradouro, numero, cidade, uf, complemento, bairro, telefone, nome } = data;
          db.collection('DadosUsuario').doc(uid).update({
            cep, logradouro, numero, cidade, uf, complemento, bairro, telefone, nome
          })
            .then(() => {
              resolve('Usuário atualizado com sucesso.');
            })
            .catch(error => {
              console.error('Erro ao atualizar dados adicionais:', error);
              reject('Erro ao atualizar informações adicionais do usuário.');
            });
        })
        .catch(error => {
          console.error('Erro ao atualizar usuário:', error);
          reject('Erro ao atualizar usuário.');
        });
    });
  }

  async excluir(uid) {
    return new Promise((resolve, reject) => {
      admin.auth().deleteUser(uid)
        .then(() => {
          const db = admin.firestore();
          db.collection('DadosUsuario').doc(uid).delete()
            .then(() => {
              resolve('Usuário excluído com sucesso.');
            })
            .catch(error => {
              console.error('Erro ao excluir dados adicionais:', error);
              reject('Erro ao excluir informações adicionais do usuário.');
            });
        })
        .catch(error => {
          console.error('Erro ao excluir usuário:', error);
          reject('Erro ao excluir usuário.');
        });
    });
  }

  async buscarTodos() {
    return new Promise((resolve, reject) => {
      const db = admin.firestore();
      db.collection('DadosUsuario').get()
        .then(async snapshot => {
          if (snapshot.empty) {
            resolve('Nenhum usuário encontrado.');
            return;
          }

          const userPromises = snapshot.docs.map(doc => {
            return admin.auth().getUser(doc.id) // Tentativa de obter o email do usuário do Firebase Auth
              .then(userRecord => {
                return { id: doc.id, email: userRecord.email, ...doc.data() };
              })
              .catch(error => {
                console.error(`Erro ao obter dados do usuário com UID ${doc.id}:`, error);
                return { id: doc.id, email: 'Email não disponível', ...doc.data() }; // Retorna sem email se houver erro
              });
          });

          Promise.all(userPromises)
            .then(users => resolve(users))
            .catch(error => {
              console.error('Erro ao processar usuários:', error);
              reject('Erro ao buscar usuários.');
            });
        })
        .catch(error => {
          console.error('Erro ao buscar todos os usuários:', error);
          reject('Erro ao buscar usuários.');
        });
    });
  }

  buscarPorUidCompleto(uid) {
    return new Promise((resolve, reject) => {
      admin.auth().getUser(uid)
        .then(userRecord => {
          // Supondo que os dados adicionais dos usuários estão armazenados no Firestore
          const db = admin.firestore();
          db.collection('DadosUsuario').doc(uid).get()
            .then(doc => {
              if (!doc.exists) {
                reject('Nenhum dado encontrado.');
              } else {
                const dados = doc.data();
                const fazendasIds = dados.fazendaId;
                const promisesFazendas = []; // Array para armazenar as promessas de busca das fazendas
                if (fazendasIds != undefined) {
                  for (let f = 0; f < fazendasIds.length; f++) {
                    const fazenda = new Fazenda();
                    promisesFazendas.push(fazenda.buscarPorUidCompleto(fazendasIds[f])); // Adiciona a promessa ao array
                  }
                }
                // Aguarda a resolução de todas as promessas
                Promise.all(promisesFazendas)
                  .then(fazendas => {
                    dados.fazendas = fazendas; // Adiciona a lista de fazendas aos dados
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
        })
        .catch(error => {
          console.error('Erro ao buscar usuário:', error);
          reject('Usuário não encontrado.');
        });
    });
  }


}

module.exports = {
  Usuario: Usuario
};
