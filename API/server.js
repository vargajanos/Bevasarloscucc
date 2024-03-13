require("dotenv").config()
var mysql = require('mysql');
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT

var pool  = mysql.createPool({
    connectionLimit : 10,
    host            : process.env.DBHOST,
    user            : process.env.DBUSER,
    password        : process.env.DBPASS,
    database        : process.env.DBNAME
});

// MIDDLEWARES
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.get('/', function (req, res) {
  res.send('Backend APi from Kisbarát to Neked')
})

// --------------------
//      Endpoints
// --------------------

// termekek table
// ------------------------------

// GET összes termék
app.get("/termekek", cors(), (req, res)=>{
    pool.query('SELECT * FROM termekek', (error, results)=>{
        if (error) throw res.send(error);
        
        res.send(results)
    });
})

// GET table by column
app.get("/:table/:column/:find", cors(), (req, res)=>{
    let column = req.params.column
    let find = req.params.find
    let table = req.params.table

    pool.query(`SELECT * FROM ${table} WHERE ${column}="${find}"`, (error, results)=>{
        if (error) throw res.send(error);
        
        res.send(results)
    });
})

// lista table
// ------------------------------

// GET összes lista
app.get("/lista", cors(), (req, res)=>{
    pool.query('SELECT * FROM lista', (error, results)=>{
        if (error) throw res.send(error);
        res.send(results)
    });
})

// GET egy lista
app.get("/lista/:pk", cors(), (req, res)=>{
    let pk = req.params.pk
    pool.query(`SELECT * FROM kapcsolo JOIN lista ON kapcsolo.lista_id = lista.id WHERE kapcsolo.lista_id = ?`, pk, (error, results)=>{
        if (error) throw res.send(error);
        
        res.send(results)
    });

})

// POST új lista
app.post("/lista", cors(), (req, res)=>{
    let data  = req.body
    pool.query(`INSERT INTO lista (id, name) VALUES(NULL, "${data.name}")`, (error, results)=>{
        if (error) throw res.status(500).send(error);
        
        res.status(200).send(results)
    });

})

// POST lista elemeit 
app.post("/lista/:pk", (req, res)=>{
    let pk = req.params.pk
    let data  = req.body
    pool.query(`INSERT INTO kapcsolo (id, lista_id, termek_id, count) VALUES(NULL, "${pk}", "${data.termek_id}", "${data.count}")`, (error, results)=>{
        if (error) throw res.status(500).send(error)
        res.status(200).send(results)
    });

})

// DELETE lista tartalma by PK
app.delete("/lista/:pk", (req, res)=>{
    let pk = req.params.pk
    pool.query(`DELETE FROM kapcsolo WHERE lista_id=?`, pk, (error, results)=>{
        if (error) throw res.send(error);
        
        res.send(results)
    });
})

app.listen(port, ()=>{
    console.log(`Server listenng on port: ${port}`)
})