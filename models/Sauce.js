const mongoose = require('mongoose'); 
const uniqueValidator = require('mongoose-unique-validator'); 

const sauceSchema = mongoose.Schema({
	name: {type: String}, 
	manufacturer: {type: String}, 
	description:  {type: String}, 
	mainPepper:  {type: String}, 
	imageUrl:  {type: String}, 
	heat: {type: Number},
	likes:  {type: Number},
	dislikes:  {type: Number},
	usersLiked: {type: [String]}, 
	usersDisliked: {type: [String]}
}); 

sauceSchema.plugin('mongoose-unique-validator'); 

module.exports = mongoose.model('Sauce', sauceSchema); 