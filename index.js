let app = require('express')();

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE,PUT');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

let http = require('http').Server(app);
let io = require('socket.io')(http);

/* io.set('transports',['websocket']); */

io.on('connection', (socket) => {
  
  socket.on('disconnect', function(){
    io.emit('users-changed', {user: socket.nickname, event: 'left'});   
  });
 
  socket.on('set-nickname', (nickname) => {
    socket.nickname = nickname;
    io.emit('users-changed', {user: nickname, event: 'joined'});    
  });
  
  socket.on('add-message', (message) => {
    io.emit('message', {text: message.text, from: socket.nickname, to: message.to , created: new Date()});    
  });
});
var port = process.env.PORT || 3001;
 
// app.use(cors());


// io.origins('http://localhost:8100');

http.listen(port, function(){
   console.log('listening in http://localhost:' + port);
});