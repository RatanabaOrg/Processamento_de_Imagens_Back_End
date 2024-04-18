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
                cliente: true,
                aprovado: false
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
          const userEmail = userRecord.email;
          const db = admin.firestore();
          db.collection('DadosUsuario').doc(uid).get()
            .then(doc => {
              if (!doc.exists) {
                reject('Nenhum dado encontrado.');
              } else {
                const userData = doc.data();
                resolve({
                  ...userData,
                  email: userEmail
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
          const { cep, logradouro, numero, cidade, uf, complemento, bairro, telefone, nome, aprovado, enderecoId } = data;
  
          // Atualizando informações na coleção DadosUsuario
          db.collection('DadosUsuario').doc(uid).update({
            telefone, nome, aprovado
          }).then(() => {
            // Atualizando informações de endereço na coleção Endereco
            db.collection('Endereco').doc(enderecoId).update({
              cep, logradouro, numero, cidade, uf, complemento, bairro
            }).then(() => {
              resolve('Usuário e endereço atualizados com sucesso.');
            }).catch(error => {
              console.error('Erro ao atualizar endereço:', error);
              reject('Erro ao atualizar endereço do usuário.');
            });
          }).catch(error => {
            console.error('Erro ao atualizar dados do usuário:', error);
            reject('Erro ao atualizar informações do usuário.');
          });
        })
        .catch(error => {
          console.error('Erro ao atualizar usuário no Auth:', error);
          reject('Erro ao atualizar usuário no Auth.');
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

  async buscarPorUidCompleto(uid) {
    try {
      const userRecord = await admin.auth().getUser(uid);
      const db = admin.firestore();
      
      const doc = await db.collection('DadosUsuario').doc(uid).get();

      if (!doc.exists) {
        throw new Error('Nenhum dado encontrado.');
      }
      const dados = {
        ...doc.data(),
        email: userRecord.email 
      };
  
      const enderecoDoc = await db.collection('Endereco').doc(dados.enderecoId).get();
      if (!enderecoDoc.exists) {
        throw new Error('Endereço não encontrado.');
      }
      dados.endereco = enderecoDoc.data();
  
      const promisesFazendas = dados.fazendaId ? dados.fazendaId.map(f => new Fazenda().buscarPorUidCompleto(f)) : [];
      dados.fazendas = await Promise.all(promisesFazendas);
  
      return dados;
    } catch (error) {
      console.error('Erro durante a busca de dados:', error);
      throw error;
    }
  };
  


}

module.exports = {
  Usuario: Usuario
};
