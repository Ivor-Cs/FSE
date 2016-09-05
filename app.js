var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Server
http.listen(8080, function(){
	console.log('listening on *:8080');
});

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

// DB section
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/FSE');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var MsgSchema = mongoose.Schema({
    username: String,
    text: String,
    date: String
});

var MsgModel = mongoose.model('MsgModel', MsgSchema);


// Sending and receiving events
io.on('connection', function(socket){
	console.log('a user connected');
	MsgModel.find(function (err, msgs) {
	  	if (err) return console.error(err);

		for (var i = 0; i < msgs.length; i++) {
			socket.emit('chat message', msgs[i]);
		}
	});

	// When server receives a message, backup and emit
	socket.on('chat message', function(msg){
		var msg_db = new MsgModel({username: msg.username, text: msg.text, date: msg.date});
		msg_db.save(function (err, msg_db) {
		  	if (err) return console.error(err);
		});

		socket.broadcast.emit('chat message', msg);
	});

	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
});