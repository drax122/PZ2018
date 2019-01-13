const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

let onlineUsers = [];



io.on("connection", socket => {
    socket.on("AcceptInv", data =>{
        // WYSLIJ INFO DO ODP KLIENTA ZE ZAPROSZENIE ZOSTALO ZAAKCEPTOWANE
        var sock = onlineUsers.filter(obj => {
            return obj.TargetPersonId === data.TargetPersonId;
        }).forEach(s=>{
            io.to(s.socketID).emit("AcceptedInvitation", data.UserId);
        });
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
        io.emit("message", data);
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
    });
    // ZIOMEK WYSŁAŁ ZAPROSZENIE DO GRONA ZNAJOMYCH
    socket.on("SendInvitation", data =>{
        onlineUsers.filter(x=> {return x.UserId === data.TargetPersonId}).forEach(e=>{
            socket.to(e.socketID).emit("InvitationSent", data);
        });
    });
    // POWIADOMIENIA
    socket.on("SendNotification", data =>{
        // Wyemituj notyfikacje do targetu :)
        onlineUsers.filter(x=> {return x.UserId === data.TargetPersonId}).forEach(e=>{
            socket.to(e.socketID, data).emit("Notification", data);
        })
    });
    // LIKES
    socket.on("Like", data =>{
        // Powiadom wszystkich poza wysyłającym 
        socket.emit("Like", data);
    });
});

http.listen(3200, () => {
      console.log("Listening is ON port 3200");
});