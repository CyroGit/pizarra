require('dotenv').config({ override: true });
const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const http= require('http');

//inicializando express
const app= express();
const server= http.createServer(app);
const io = socketio(server);
// set express
app.set('port',  process.env.PORT || 3000);
require('./sockets')(io);
app.use(express.static(path.join(__dirname,'public')));
//start server
server.listen(app.get('port'),()=>{
console.log("server onStart")
//console.log(path.join(__dirname,'public'));
});
