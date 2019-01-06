var express = require('express');	
var fs = require('fs');

var url = require('url');

var app = express();


/* ************************************ */
/* ******* website root request ******* */
app.get('/', function(req, res) {
	
	
	fs.readFile('./../MenuMorceaux.html', function(err, data) {
		if (err){
			throw err;
		}
		res.setHeader('Content-Type', 'text/html');
		res.write(data);
		res.end();
	});
});
/* ******* end website root request ******* */
/* **************************************** */

/* **************************************** */
/* ******* website root other files ******* */
app.get('/:sourceFile', function(req, res) {
	
	// test sourceFile extension
	req.params.sourceFile.match(/\.(\w+)$/)
	var extension=RegExp.$1;
	console.log("demande du fichier " + req.params.sourceFile + " dont l'extension est " + extension);
	
	fs.readFile('./../'+req.params.sourceFile, function(err, data) {
		if (err){
			throw err;
		}
		res.setHeader('Content-Type', 'text/'+extension);
		res.write(data);
		res.end();
	});
	
});
/* ******* end website root other files ******* */
/* ******************************************** */

/* ************************************* */
/* ******* website picture files ******* */
app.get('/plats/:imgPlat', function(req, res) {
	
	// test image extension
	req.params.imgPlat.match(/\.(\w+)$/)
	var extension=RegExp.$1;
	console.log("demande du fichier " + req.params.imgPlat + " dont l'extension est " + extension);
	
	fs.readFile('./../plats/'+req.params.imgPlat, function(err, data) {
		if (err){
			//throw err;
			console.log("fichier inexistant: " + './../'+req.params.imgPlat);
			res.setHeader('Content-Type', 'text/plain');
			res.write('fichier introuvable');
			res.end();
		}
		else
		{
			res.setHeader('Content-Type', 'image/'+extension);
			res.write(data);
			res.end();
		}
	});
	
});
/* ******* website picture files ******* */


/* ************************* */
/* ******* not found ******* */
app.use(function(req, res, next){
	var  page = url.parse(req.url).pathname;
	console.log("demande de page introuvable : " + page);
	res.writeHead(404, {"Content-Type": "text/plain"});
    res.write('Page introuvable');
	res.end();
});
/* ******* end not found ******* */
/* ***************************** */


// start listening !
app.listen(80);
console.log("listening on port 80");