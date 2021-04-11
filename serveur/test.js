var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

console.log("\n\n\n");
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
  console.log("get requested");
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
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
server.listen(8080);
// WARNING: app.listen(80) will NOT work here!