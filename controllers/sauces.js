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
	const thingObject = req.file ? //opérateur ternaire
		{ 
			...JSON.parse(req.body.sauce), 
			imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
		} : { ...req.body }; 
	Sauce.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
		.then(() => res.status(200).json({ message: "Objet modifié"}))
		.catch( error => res.status(400).json({ error })); 
}; 

exports.deleteOneSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then(thing => {
			const filename = thing.imageUrl.split('/images/')[1]; 
			fs.unlink(`images/${filename}`, () => {
				Sauce.deleteOne({ _id: req.params.id })
					.then(() => res.status(200).json({ message: "Sauce supprimée"}))
					.catch( error => res.status(400).json({ error })); 
			}); 
		})
		.catch(error => res.status(500).json({ error })); 
}; 

exports.speakUpOneSauce = (req, res, next) => {

}; 