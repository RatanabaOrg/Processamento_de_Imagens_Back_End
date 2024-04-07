
const serviceAccount = require('../firebaseAdminConfig.json');
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

class Usuario {
    login(data){
        const { email, password } = data;
        admin.auth().getUserByEmail(email)
          .then(userRecord => {
            // Aqui você pode adicionar mais lógica para validar a senha, etc.
            // Por exemplo, se estiver usando o Firebase Authentication, você precisaria usar o SDK do lado do cliente para verificar a senha.
            console.log("aaaaaaa");
            return `Usuário logado com sucesso: ${userRecord.toJSON()}`
          })
          .catch(error => {
            console.error('Erro ao buscar usuário:', error);
            return 'Erro ao buscar as informações do usuário.'
          });
    }


    cadastro(data){
        const { name, email, password, confirmPassword, phone, cep, logradouro, number, city, uf } = data;
  
        // Validar os dados de entrada aqui (como exemplo, apenas a senha está sendo validada)
        if (password !== confirmPassword) {
          return res.status(400).send('As senhas não coincidem.');
        }
      
        // Criação do usuário no Firebase Authentication
        admin.auth().createUser({
          email,
          password,
          phoneNumber: phone,
          displayName: name,
          // Você pode adicionar mais campos aqui conforme necessário
        })
        .then(userRecord => {
          // Após a criação do usuário, armazene as informações adicionais no Firestore ou no Realtime Database
          const userId = userRecord.uid;
          // Exemplo de como salvar dados adicionais no Firestore
          const db = admin.firestore();
          db.collection('users').doc(userId).set({
            cep,
            logradouro,
            number,
            city,
            uf,
            // Adicione outros campos conforme necessário
          })
          .then(() => {
            return 'Usuário cadastrado com sucesso.'
          })
          .catch(error => {
            console.error('Erro ao salvar dados adicionais:', error);
            return 'Erro ao salvar informações adicionais do usuário.'
          });
        })
        .catch(error => {
          console.error('Erro ao criar usuário:', error);
          return 'Erro ao cadastrar usuário.'
        });
    }
}

module.exports = {
    Usuario: Usuario
}  