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