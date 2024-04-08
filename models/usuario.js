const admin = require('firebase-admin');
const serviceAccount = require('../firebaseAdminConfig.json');

if (admin.apps.length === 0) { 
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

class Usuario {
  cadastro(data) {
    return new Promise((resolve, reject) => {
      const { nome, email, senha, confirmarSenha, telefone, cep, logradouro, numero, cidade, uf, complemento, bairro } = data;

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
          db.collection('DadosUsuario').doc(userId).set({
            cep,
            logradouro,
            bairro,
            cidade,
            complemento,
            uf,
            telefone,
            nome,
            numero,
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
          // Supondo que os dados adicionais dos usuários estão armazenados no Firestore
          const db = admin.firestore();
          db.collection('DadosUsuario').doc(uid).get()
            .then(doc => {
              if (!doc.exists) {
                reject('Nenhum dado encontrado.');
              } else {
                resolve(doc.data());
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
  

}

module.exports = {
  Usuario: Usuario
};
