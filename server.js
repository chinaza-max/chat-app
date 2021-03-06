let con=require('./DB/Mongodb.js');



const http=require('http');
const express=require('express');
//const socketio=require('socket.io');
const app=express();
const path = require('path');
app.use(express.static('public'));
/*
const clientpath=`${__dirname}/client`;
app.use(express.static(clientpath));*/
const server=http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
      origin: "http://127.0.0.1:5500",
      methods: ["GET", "POST"]
    }
});

app.get('/:id',function(req,res){
        res.sendFile(path.join(__dirname+'/client/index.html'));
});

io.of("/letgo").on('connection', (sock) => { 
    sock.on("room",(data)=>{

        con.query(`USE mydb2`);

        sock.join(data.roomName)
        let roomNO=  Array.from(io.of("/letgo").in(data.roomName).adapter.rooms);
      

        let sql=`CREATE TABLE IF NOT EXISTS ?? (name VARCHAR(255), message VARCHAR(255), room VARCHAR(255))`;
                            con.query(sql,[data.roomName],(err,result)=>{
                                if(err) throw err;
                            })

        let sql2=`SELECT * FROM ??`
        con.query(sql2,[data.roomName] ,function (err, result, fields) {
            if (err) throw err;
            sock.emit('updateMessage',result);
        });

        for(room in roomNO){
            if(roomNO[room][0]==data.roomName){
                if(roomNO[parseInt(room)+1]){

                    //its runs when the room has two user
                    io.of("/letgo").in(data.roomName)
                    .emit("newUser",data)
                }
            }
        }
        sock.on('disconnect',()=>{ 
            io.of("/letgo").in(data.roomName)
                .emit("connectionStatus","disconnected refresh")
        })
       
    })

    //for exchanging user name
    sock.on("updateName",(data)=>{
        sock
        .to(data.room).emit("updateName",data)
    })

    //handles chats
    sock.on("roomChats",(data)=>{
    
            let sql = "INSERT INTO ?? (`name`, `message`,`room`) VALUES ('"+data.friendname+"','"+data.message+"','"+data.room+"')";
            con.query(sql,[data.room], function (err, result) {
                if (err) throw err;
            });

            sock.to(data.room).emit("chats",data)
    })

    sock.on("Typing",(room)=>{
        sock
        .to(room).emit("typingFun","")
    })
    sock.on("StopTyping",(room)=>{
        sock
        .to(room).emit("StopTypingFun","")
    })
});

server.listen(8080,()=>{
    console.log('Started on 8080');
});