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



// Vérification du TOKEN d'authentification
module.exports = (req, res, next) => {
    try {
        console.log(req.body);
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'SECRET_KEY_TOKEN');
        const userId = decodedToken.userId;
        if(req.body.userId && req.body.userId !== userId) {
            throw 'ID utilisateur incorrect !';
        } else {
            next();
        }
    } catch(error) {
        res.status(401).json({error});
    }
}