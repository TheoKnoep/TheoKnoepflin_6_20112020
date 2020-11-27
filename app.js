const express = require('express'); //on importe express
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose'); 

const userRoutes = require('./routes/user'); 

mongoose.connect('mongodb+srv://first_user_4991:jzS5wAP001nDXO52@coursocgofullstack.3ppnx.mongodb.net/sopekocko?retryWrites=true&w=majority',
	{ useNewUrlParser: true, useUnifiedTopology: true })
			.then(() => console.log('Connexion à MongoDB réussie !'))
			.catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express(); 

app.use((req, res, next) => { //Déclaration des headers CORS 
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	next();
});


app.use(bodyParser.json());

app.use('/api/auth', userRoutes); 

module.exports = app; 