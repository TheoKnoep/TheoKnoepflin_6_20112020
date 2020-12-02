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
			let newLikesSum = sauce.likes; 
			let newUsersLikes = [...sauce.usersLiked];
			let newDislikesSum = sauce.dislikes;
			let newUsersDislikes = [...sauce.usersDisliked];
			let indexLike = sauce.usersLiked.indexOf(req.body.userId); 
			let indexDislike = sauce.usersDisliked.indexOf(req.body.userId); 
			switch (req.body.like) {
				case 1 : 
					if (indexLike === -1 ) {
						newLikesSum += 1 ; 
						newUsersLikes.push(req.body.userId); 
					} else {
						return res.status(501).json({message: "une erreur est survenue"});
					}
					break; 
				case -1 : 
					if (indexDislike === -1 ) {
						newDislikesSum += 1 ; 
						newUsersDislikes.push(req.body.userId); 
					} else {
						return res.status(502).json({message: "une erreur est survenue"});
					}	
					break
				case 0 : 
					if (indexLike != -1 ) { //CAS user a liké la sauce 
						newLikesSum -= 1 ; 
						newUsersLikes.splice(indexLike, 1); 
					} else if (indexDislike != -1) { //CAS user a disliké la sauce
						newDislikesSum -= 1 ; 
						newUsersDislikes.splice(indexDislike, 1); 
					} else {
						return res.status(503).json({message: "une erreur est survenue"});
					}
					break; 
			 }
			 Sauce.updateOne({ _id: req.params.id }, { likes: newLikesSum, usersLiked: newUsersLikes, dislikes: newDislikesSum, usersDisliked: newUsersDislikes })
					.then( () => res.status(200).json({message: `L'utilisateur ${req.body.userId} a mis à jour ses préférences de sauces` }))
					.catch( error => res.status(400).json({ error })); 
		})
		.catch( error => res.status(400).json({ message: 'Erreur du findOne()', error: error })); 
}; 