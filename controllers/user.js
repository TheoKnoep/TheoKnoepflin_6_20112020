const bcrypt = require('bcrypt'); 
const User = require('../models/User'); 
const jwt = require("jsonwebtoken"); 
const emailValidator = require('email-validator'); 
const passwordValidator = require('password-validator'); 

const schema = new passwordValidator(); 
//Schéma de mot de passe : au moins 8 caractères, avec au moins 1 capitale et 1 chiffre :
schema.is().min(8); 
schema.has().uppercase(); 
schema.has().digits(1); schema.is().not().oneOf(['Azert'])


const cryptojs = require('crypto-js'); 



exports.signup = (req, res, next) => {
	const cryptedEmail = cryptojs.HmacSHA256(req.body.email, process.env.EMAIL_ENCRYPTION_KEY).toString(); 
	if (emailValidator.validate(req.body.email) && schema.validate(req.body.password)) {
		bcrypt.hash(req.body.password, 10)
			.then(hash => {
				const user = new User({
					email: cryptedEmail, 
					password: hash
				}); 
				user.save()
					.then(() => res.status(201).json({ message: "Utilisateur créé"}))
					.catch(error => res.status(400).json({ error })); 
			})
			.catch(error => res.status(500).json({ error })); 
	} else { 
		console.log("Format d'email non valide"); 
		res.status(409).json({message: "Format d'email non valide"}); 
	}
}; 

exports.login = (req, res, next) => {
	const cryptedEmail = cryptojs.HmacSHA256(req.body.email, process.env.EMAIL_ENCRYPTION_KEY).toString(); 
	User.findOne({ email: cryptedEmail})
	.then(user => {
	  if (!user) {
	    return res.status(401).json({ error: "Utilisateur non trouvé" });
	  }
	  bcrypt.compare(req.body.password, user.password)
	    .then(valid => {
	      if (!valid) {
		return res.status(401).json({ error: 'Mot de passe incorrect !' });
	      }
	      res.status(200).json({
		userId: user._id,
		token: jwt.sign(
			{ userId: user._id }, 
			process.env.TOKEN_SALT, 
			{ expiresIn: '24h' }
		)
	      });
	    })
	    .catch(error => res.status(500).json({ error }));
	})
	.catch(error => res.status(500).json({ error }));
}; 