let mysql = require('mysql');


let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: ""
  });
  
con.connect(function(err) {  
    if (err) throw err;
    console.log("Connected!");

    con.query("CREATE DATABASE IF NOT EXISTS mydb2",(err,result)=>{
        if (err) throw err;
    })
});

module.exports=con;