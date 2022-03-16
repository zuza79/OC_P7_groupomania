
// Import du package http 
const http = require('http');

 // Import de l'application epress
const app = require('./app');

// La fonction normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne - Cela configure le port de connection en fonction de l'environnement
const normalizePort = val => {
    const port = parseInt(val, 10);
  
    if (isNaN(port)) {
      return val;
    }
    if (port >= 0) {
      return port;
    }
    return false;
  };
  // Ajout du port de connection si celui-ci n'est pas declarer par l environnement
// Si aucun port n'est fourni on écoutera sur le port 3000
  const port = normalizePort(process.env.PORT || '3000');
  

 
const errorHandler = error => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges.');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use.');
        process.exit(1);
        break;
      default:
        throw error;
    }
  };
  
// Créer un serveur avec node.js on utilisant l'app express
const server = http.createServer(app);

// gestions des évenements serveur pour un retour console
// Lance le serveur et affiche sur quel port se connecter ou gère les erreurs s'il y en a
server.on('error', errorHandler);
server.on('listening', () => { // Un écouteur d'évènements qui enregistre le port nommé sur lequel le serveur s'exécute dans la console
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

// Le serveur écoute le port définit plus haut
server.listen(process.env.PORT || 3000);