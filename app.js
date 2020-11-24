const express = require('express'); //on importe express

const app = express(); 

app.use((req, res) => {
	res.json({message: "Ok"}); 
}); 

module.exports = app; 