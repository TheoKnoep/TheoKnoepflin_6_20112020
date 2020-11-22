const http = require('http');  //on importe le package http de Node 
const app = require('./app'); 

app.set('port', process.env.PORT || 4200); 
const server = http.createServer(app); //'app' va fonctionner comme une application qui va recevoir les requête et gérer leurs réponses

server.listen(process.env.PORT || 4200); 