const mysql = require('./DB/mysql.js');

const http=require('http');
const express=require('express');
const app=express();
const path = require('path');
app.use(express.static('public'));
app.get('*',function(req,res){
        res.sendFile(path.join(__dirname+'/client/index.html'));
});
const server=http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
      origin: (origin, callback) => {
        const allowedOrigins = [
          "https://chat-app-u3pz.onrender.com",
        ];
        if (allowedOrigins.includes(origin) || !origin) {
// The origin is allowed, so return true
          callback(null, true);
        } else {
          // The origin is not allowed, so return an error
          callback(new Error("This origin is not allowed."));
        }
      },
      methods: ["GET", "POST"]
    }
});

app.get('*',function(req,res){
        res.sendFile(path.join(__dirname+'/client/index.html'));
});

io.of("/letgo").on('connection', async (sock) => {
    sock.on("room",async (data)=>{
  
        const connection = await mysql.getConnection();
  
        console.log(data.roomName)
        console.log(data.roomName)
        console.log(data.roomName)
        console.log(data.roomName)
        console.log(data.roomName)
        console.log(data.roomName)
  
  
        sock.join(data.roomName)
        let roomNO=  Array.from(io.of("/letgo").in(data.roomName).adapter.rooms);
  
        const tableName = data.roomName;
  
        const [rows] = await connection.execute(`CREATE TABLE IF NOT EXISTS \`${tableName}\` (id INT NOT NULL AUTO_INCREMENT, name VARCHAR(255), message VARCHAR(255), room VARCHAR(255), PRIMARY KEY (id))`);

        const [rows2] = await connection.execute('SELECT * FROM ??', [tableName]);
  
        sock.emit('updateMessage', rows2);
  
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
  
    });
  
    //for exchanging user name
    sock.on("updateName",(data)=>{
        sock
        .to(data.room).emit("updateName",data)
    })
  
    //handles chats
    sock.on("roomChats",async(data)=>{
  
            await connection.execute(`INSERT INTO \`${data.room}\` (name, message, room) VALUES (?, ?, ?)`, [data.friendname, data.message, data.room]);
  
            const [rows3] = await connection.execute('SELECT * FROM ??', [data.room]);
  
            sock.to(data.room).emit("chats",rows3)
  
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