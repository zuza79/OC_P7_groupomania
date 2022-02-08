// Importation des modules
const jwt = require('jsonwebtoken');
// require('dotenv').config();


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

/*const jwt = require('jsonwebtoken');

require('dotenv').config()

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1]; //Récupère seulement le token du header authorization de la requête
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); //Decode le token en vérifiant le token avec celui présent dans la fonction login
        const userId = decodedToken.userId; //Récupère le userId
        if (req.body.userId && req.body.userId !== userId) { //Vérifie s'il y a un userId dans la requête et que celui ci est différent de l'user Id alors
            throw new Error('403:unauthorized request'); //Renvoie l'erreur
        }else{
            next();
        }
    }catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée'});
    }
};
*/