const port = 3001;
var app = require('express')();
var http = require('http').Server(app);
// var https = require('https');
const fs = require('fs');
var io = require('socket.io')(http);

// var https_options = {
//     key: fs.readFileSync('./certs/key.pem'),
//     cert: fs.readFileSync('./certs/cert.pem'),

// };
// const host = "http://10.10.0.239:3000/"
// app.get('/', function (req, res) {
//     res.send("HELLO");
// });
// var PossibleClients = new Set();
// let PossibleClientsArr;
// let userMsg = [];
// let allMsgs = [];

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
          if (clients[data.reciepient] || clients[data.username]){
            // console.log(clients[data.reciepient].socket)
          io.sockets.connected[clients[data.reciepient].socket].emit("add-message", data);
          io.sockets.connected[clients[data.username].socket].emit("add-message", data);
        } else {
          console.log("User does not exist: " + data.reciepient); 
        }
      });
          socket.on('disconnect', function (res) {
              console.log("DISCONNECTED USER")
          });
    });
//     PossibleClientsArr = [...PossibleClients]
//     // console.log(PossibleClientsArr)

//     socket.on('sendMsg', sendMsg => {
//         if(sendMsg !== ''){
//             allMsgs.push(sendMsg)
//         }
//         PossibleClientsArr = [...PossibleClients]
//         PossibleClientsArr.map(res => {
//             console.log("res", res)
//             allMsgs.map(msg => {
//                 console.log(msg)
//                 if(msg.reciepient === res){
//                     userMsg.push(msg)
//                 }
//              console.log(userMsg)
//              io.socket.connected(res).emit("sendMsg", userMsg)
//             })              
//         })
//         io.emit("sendMsg" , allMsgs)
//     })
// });

http.listen(port, function () {
    console.log(`listening on :${port}`);
});

// https.createServer(https_options, app).listen(port, () => {
//     console.log(`zdre ot ${port}`)
// })