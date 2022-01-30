// Importation de jsonwebtoken
const jwt = require('jsonwebtoken');


// Exportation des différentes fonctions
module.exports = {

    // Création d'un nouveau token
    generateTokenForUser: (userData) => {
        return jwt.sign(
        {
            userId: userData.id,
            role: userData.role
        }, 
        'SECRET_KEY_TOKEN',
        { expiresIn: '4h' }        
        )
    },

    // Formatage du token
    parseAuthorization: (authorization) => {
        return (authorization != null) ? authorization.replace('Bearer ', '') : null;        
    },

    // Récupération de l'ID de l'utilisateur dans le token
    getUserId: (authorization) => {
        let userId = -1;
        const token = module.exports.parseAuthorization(authorization);
        
        if(token != null) {
            try {
                const jwtToken = jwt.verify(token, 'SECRET_KEY_TOKEN');
                if(jwtToken != null) {
                    userId = jwtToken.userId;
                }
            } catch (err) { 
                console.log(err);
            }
        }
        return userId;
    }
}