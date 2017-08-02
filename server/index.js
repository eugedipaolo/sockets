var express = require('express'); //cargamos el modulo de node 
var app = express(); //llamamos al metodo express que viene de la libreria de express
var server = require('http').Server(app); //cargamos la libreria http y al metodo server le pasamos la app 
//pasar server  a socket io para que sepa que esta escuchando dentro de la conexion http
var io = require('socket.io')(server);

//usaremos un middleware de express
app.use(express.static('client'));

app.get('/saludo', function(req,res){
	res.status(200).send('Saludos!');
});

var messages = [{
	id:1,
	text:'Bienvenido',
	nickname: 'Menia'
}]


//lanzamos el evento connection mediante el metodo on
io.on('connection', function(socket){
	//recojemos la ip de quien se conecta
	console.log("se ha conectado la IP: " + socket.handshake.address );
	socket.emit('messages', messages);
	//cuando suceda add-messages desde el cliente se le añaden datos al array de mensajes
	socket.on('add-message',function(data){
		messages.push(data);
		//emite los mensajes a todos los clientes del chat que esten conectados
		io.sockets.emit('messages',messages);
	});

});

//crear servidor con express
server.listen(6677,function(){
	console.log('servidor funcionando');

});