const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

let onlineUsers = [];



io.on("connection", socket => {
    socket.on("AcceptInv", data =>{
        // WYSLIJ INFO DO ODP KLIENTA ZE ZAPROSZENIE ZOSTALO ZAAKCEPTOWANE
        var sock = onlineUsers.filter(obj => {
            return obj.UserId === data.UserId;
        })
        if(sock){ // Tylko jeśli faktycznie jest zalogowany
            io.to(sock.socketID).emit("AcceptedInvitation", data.TargetPersonId);
        }

    });
    socket.on("IMIN", UserId =>{
        onlineUsers.push({ "socketID" : socket.id, "UserId" : UserId});
        io.emit("UserLoggedIn", UserId);
        io.to(socket.id).emit("UsersOnline", onlineUsers);

        console.log("User joined: " + socket.id + " / "+ UserId );
    });
    socket.on("IMOUT", data =>{ // data - UserId
        io.emit("UserLoggedOut", data);
        console.log("User out : "+ socket.id + " / " + data);
        onlineUsers = onlineUsers.filter(function(elem){
            return elem.UserId !== data;
        });
    });
    socket.on("SendPost", data => {
        io.emit("NewPost", data);
    });
    socket.on("SendMessage", data =>{
        var i = onlineUsers.filter(obj => {
            return obj.UserId === data.UserId;
        });
        if(i){
            io.to(i.socketID).emit("NewMessage");
        }
    });
    
    socket.on("disconnect", ()=> {
        var i = onlineUsers.filter(obj => {
            return obj.socketID === socket.id
        });
        if(i.length > 0){
            io.emit("UserLoggedOut", i.pop().UserId);
            onlineUsers = onlineUsers.filter(function(elem){
                return elem.socketID != socket.id;
            });
            console.log("User out: " + socket.id);
        }
    })
});

http.listen(3200, () => {
      console.log("Listening is ON port 3200");
});