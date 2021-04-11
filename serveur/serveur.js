var fs = require('fs');
var io = require('socket.io');

var url = require('url');

// var app = express();

var app = require('express')();	
var server = require('http').Server(app);
var io = require('socket.io')(server);


// ************************************ //
// ******* website root request ******* //
app.get('/', function(req, res) {
	
	console.log("\n\n\tnouvelle connexion\n");
	fs.readFile('./site/MenuMorceaux.html', function(err, data) {
		if (err){
			throw err;
		}
		res.setHeader('Content-Type', 'text/html');
		res.write(data);
		res.end();
	});
});
// ******* end website root request ******* //
// **************************************** //

// **************************************** //
// ******* website root other files ******* //
//app.get('/:sourceFile', function(req, res) { // replaced by a regex and a manual extract to be able to match sub-pathes.
app.get('/*', function(req, res) {
	
	var url = req.url;
	/\/(.*)$/.exec(url);
	var sourceFile = RegExp.$1;
	// test sourceFile extension
	sourceFile.match(/\.(\w+)$/);
	var extension=RegExp.$1;
	console.log("demande du fichier " + sourceFile + " dont l'extension est " + extension);
	
	
	fs.readFile('./site/'+sourceFile, function(err, data) {
		if (err){
			//throw err;
			//console.log(err);
			console.log("$1 - fichier inexistant: " + './site/'+sourceFile);
			res.setHeader('Content-Type', 'text/plain');
			res.write('fichier introuvable');
			res.end();
		}
		else
		{
			console.log("trouvage du fichier " + './site/'+sourceFile + " dont l'extension est " + extension);
			res.setHeader('Content-Type', 'text/'+extension);
			res.write(data);
			res.end();
		}
	});
	
});
// ******* end website root other files ******* //
// ******************************************** //

// ************************************* //
// ******* website picture files ******* //
app.get('/plats/(.*/)*:imgPlat', function(req, res) {
	
	// test image extension
	req.params.imgPlat.match(/\.(\w+)$/);
	var extension=RegExp.$1;
	console.log("demande du fichier image " + req.params.imgPlat + " dont l'extension est " + extension);
	
	fs.readFile('./site/plats/'+req.params.imgPlat, function(err, data) {
		if (err){
			//throw err;
			//console.log(err);
			console.log("$2 - fichier inexistant: " + './site/'+req.params.imgPlat);
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
// ***** end website picture files ***** //
// ************************************* //

// ************************* //
// ******* not found ******* //
app.use(function(req, res, next){
	var  page = url.parse(req.url).pathname;
	console.log("$4 - demande de page introuvable : " + page);
	res.writeHead(404, {"Content-Type": "text/plain"});
    res.write('Page introuvable');
	res.end();
});
// ***** end not found ***** //
// ************************* //


// ************************* //
// ******* Websocket ******* //
io.on('connection', function (socket) {
    console.log('Un client est connecté !');
	socket.emit('message', 'Vous êtes bien connecté !');
	
	
    // Quand le serveur reçoit un signal de type "message" du client    
    socket.on('message', function (message) {
        console.log('Un client me parle ! Il me dit : ' + message);
    });	
});

// ***** end Websocket ***** //
// ************************* //

// start listening !
//app.listen(314);
server.listen(314);
console.log("listening on port 314");