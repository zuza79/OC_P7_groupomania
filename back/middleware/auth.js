const jwt = require('jsonwebtoken');

require('dotenv').config()

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1]; //recuperation header authorization of requet
        const decodedToken = jwt.verify(token, process.env.TOKEN); //Decoded token, verify by token
        const userId = decodedToken.userId; // userId
        if (req.body.userId && req.body.userId !== userId) { //compared userId
            throw new Error('403:unauthorized request'); //error
        }else{
            next();
        }
    }catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée'});
    }
};

