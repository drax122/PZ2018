const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

let onlineUsers = [];

io.on("connection", socket => {
    socket.on("IMIN", UserId =>{
        io.emit("UserLoggedIn", UserId);
        io.to(socket.id).emit("UsersOnline", onlineUsers);
        onlineUsers.push({ "socketID" : socket.id, "UserId" : UserId});
        console.log("User joined: " + socket.id);
    });
    socket.on("IMOUT", data =>{
        var i = onlineUsers.filter(obj => {
            return obj.socketID === socket.id
        });
        io.emit("UserLoggedOut", i.UserId);
        onlineUsers = onlineUsers.filter(function(elem){
            return elem.socketID != socket.id;
        });
        console.log("User out : "+ socket.id);
    });
    socket.on("disconnect", ()=> {
        io.emit("IMOUT", socket.id);
        onlineUsers = onlineUsers.filter(function(elem){
            return elem.socketID != socket.id;
        });
        console.log("User out: " + socket.id);
    })
});

http.listen(3200, () => {
      console.log("Listening is ON port 3200");
});