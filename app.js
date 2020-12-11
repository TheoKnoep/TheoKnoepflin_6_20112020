const express = require('express'); //on importe express
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose'); 
const path = require('path'); 

const userRoutes = require('./routes/user'); 
const saucesRoutes = require('./routes/sauces'); 

const helmet = require('helmet'); 
const mongoSanitize = require('express-mongo-sanitize'); 

require('dotenv').config(); 

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@coursocgofullstack.3ppnx.mongodb.net/sopekocko?retryWrites=true&w=majority`,
	{ useNewUrlParser: true, useUnifiedTopology: true })
			.then(() => console.log('Connexion à MongoDB réussie !'))
			.catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express(); 

app.use(helmet()); 

app.use((req, res, next) => { //Déclaration des headers CORS 
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	next();
});


app.use(bodyParser.urlencoded({extended: true})); 
app.use(bodyParser.json());
app.use(mongoSanitize()); 

app.use('/images', express.static(path.join(__dirname, 'images'))); 

app.use('/api/auth', userRoutes); 
app.use('/api/sauces', saucesRoutes); 

module.exports = app; 