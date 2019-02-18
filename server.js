const port = 3001;
var app = require('express')();
var http = require('http').Server(app);
const fs = require('fs');
var io = require('socket.io')(http);



function writeLog(data){ // 
  fs.readFile('Logs.txt', 'utf8', function(err, contents) {
    console.log('userd space in log file=', contents.length)
    let log = JSON.stringify(data)
    if(contents.length + log.length >= 100) return 
    fs.appendFileSync('Logs.txt', log + ',');
  });
}

var clients = {};
io.on('connection', function (socket) {

    socket.on('add-user', function(data){
        clients[data.username] = {
          "socket": socket.id
        };
        console.log("CONNECTED = ", data.username)
      });
      socket.on('private-message', function(data){
          console.log("Sending: " + data.msg + " to " + data.reciepient);
          if (clients[data.reciepient] !== undefined && clients[data.username] !== ''){
            writeLog(data)
          io.sockets.connected[clients[data.reciepient].socket].emit("add-message", data);
          io.sockets.connected[clients[data.username].socket].emit("add-message", data);
          
        } else {
          console.log("User does not exist: " + data.reciepient); 
        }
      });
      socket.on('broadcast', function(res){
        writeLog(res)
        socket.broadcast.emit('broadcast', res)
      })
          socket.on('disconnect', function (res) {
              console.log("DISCONNECTED USER")
          });
    });


http.listen(port, function () {
    console.log(`listening on :${port}`);
});
