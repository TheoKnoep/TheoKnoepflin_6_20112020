const Sauce = require('../models/Sauce'); 
const fs = require('fs'); 

exports.getAllSauces = (req, res, next) => {
	Sauce.find()
		.then((sauces) => { res.status(200).json(sauces); })
		.catch(	(error) => { res.status(400).json({ error: error }); });
}; 

exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => res.status(200).json(sauce))
		.catch( error => res.status(400).json({ error })); 
}; 

exports.createOneSauce = (req, res, next) => {
	console.log(req.body); //pourquoi ne s'affiche pas dans la console ?
	const sauceObject = JSON.parse(req.body.sauce); 
	delete sauceObject._id; 
	const sauce = new Sauce ({ 
		userId: sauceObject.userId, 
		name: sauceObject.name, 
		manufacturer: sauceObject.manufacturer, 
		description:  sauceObject.description, 
		mainPepper:  sauceObject.mainPepper, 
		imageUrl:  `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, 
		heat: sauceObject.heat,
		likes: 0,
		dislikes: 0,
		usersLiked: [], 
		usersDisliked: []
	}); 
	sauce.save()
		.then((sauce) => res.status(201).json({ message: sauce}))
		.catch( error => res.status(400).json({ error })); 
}; 

exports.modifyOneSauce = (req, res, next) => {
	const sauceObject = req.file ? //opérateur ternaire
		{ 
			...JSON.parse(req.body.sauce), 
			imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
		} : { ...req.body }; 
	Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
		.then(() => res.status(200).json({ message: "Objet modifié"}))
		.catch( error => res.status(400).json({ error })); 
}; 

exports.deleteOneSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then(sauce => {
			const filename = sauce.imageUrl.split('/images/')[1]; 
			fs.unlink(`images/${filename}`, () => {
				Sauce.deleteOne({ _id: req.params.id })
					.then(() => res.status(200).json({ message: "Sauce supprimée"}))
					.catch( error => res.status(400).json({ error })); 
			}); 
		})
		.catch(error => res.status(500).json({ error })); 
}; 

exports.speakUpOneSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then(sauce => {
			const userID = req.body.userId; 
			switch (req.body.like) {
				case 1: 
					if (sauce.usersLiked.indexOf(userID) = -1) { 
						sauce.usersLiked.push(userID); 
						sauce.likes ++ ;
						sauce.save()
							.then(() => res.status(200).json({ message: `L'utilisateur ${userID} a liké la sauce`}))
							.catch( error => res.status(400).json({ error })); 
					} else {/*L'utilisateur a déjà liké la sauce*/}; 
					break; 
				case -1: 
					if (sauce.usersDisliked.indexOf(userID) = -1) {
						sauce.usersDisliked.push(userID); 
						sauce.dislikes ++; 
						sauce.save()
							.then(() => res.status(200).json({ message: `L'utilisateur ${userID} a disliké la sauce`}))
							.catch( error => res.status(400).json({ error })); 
					} else {/* L'utilisateur a déjà disliké la sauce */}
					break; 
				case 0: 
					let stateLikeOrDislike = ''; 
					if (sauce.usersLiked.indexOf(userID) = -1) {
						stateLikeOrDislike = 'disliked'; 
					} else {
						stateLikeOrDislike = 'liked'; 
					}; 
					if (stateLikeOrDislike = 'liked') { //cas où on doit annuler le like
						sauce.likes --; 
						let indexOdUserToDelete = sauce.usersLiked.indexOf(userID); 
						sauce.usersLiked.splice(indexOdUserToDelete, 1); 
						sauce.save()
							.then(() => res.status(200).json({ message: `L'utilisateur ${userID} a annulé son like`}))
							.catch( error => res.status(400).json({ error })); 
					} else { //cas où on doit annuler le dislike
						sauce.dislikes -- ; 
						let indexOdUserToDelete = sauce.usersDisliked.indexOf(userID); 
						sauce.usersDisliked.splice(indexOdUserToDelete, 1); 
						sauce.save()
							.then(() => res.status(200).json({ message: `L'utilisateur ${userID} a annulé son dislike`}))
							.catch( error => res.status(400).json({ error }));
					}


					break; 
				default: 
					console.log(`Erreur`); 
			}; 
		})
		.catch( error => res.status(400).json({ error })); 
}; 