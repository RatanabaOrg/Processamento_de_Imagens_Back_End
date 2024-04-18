const admin = require('firebase-admin');
const serviceAccount = require('../firebaseAdminConfig.json');
const { Usuario } = require('./usuario');

if (admin.apps.length === 0) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

class Verificacao {
    async verificarToken(idToken) {
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
    
            var usuario = new Usuario();
            const userRecord = await usuario.buscarPorUid(decodedToken.uid);
    
            if (userRecord.cliente) {
                return decodedToken.uid;
            } else {
                return "adm";
            }
        } catch (error) {
            console.error('Erro ao verificar token:', error);
            return false
        }
    }
    
}

module.exports = {
    Verificacao: Verificacao
};
