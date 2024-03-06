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

// GET one termekek by category
app.get("/termekek/:pk", cors(), (req, res)=>{
    let pk = req.params.pk
    pool.query(`SELECT * FROM termekek WHERE category=?`, pk, (error, results)=>{
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
app.get("/kapcsolo/:pk", cors(), (req, res)=>{
    let pk = req.params.pk
    pool.query(`SELECT * FROM kapcsolo WHERE lista_id=?`, pk, (error, results)=>{
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

// PATCH one employee by PK
app.patch("/termekek/:pk", (req, res)=>{
    let pk = req.params.pk
    let data  = req.body
    pool.query(`UPDATE termekek SET name="${data.name}", address="${data.address}", phone="${data.phone}", email="${data.email}", post="${data.post}", price=${data.price} WHERE ID=?`, pk, (error, results)=>{
        if (error) throw res.status(500).send(error)
        res.status(200).send(results)
    });

})

// DELETE one employee by PK
app.delete("/termekek/:pk", (req, res)=>{
    let pk = req.params.pk
    pool.query(`DELETE FROM termekek WHERE ID=?`, pk, (error, results)=>{
        if (error) throw res.send(error);
        
        res.send(results)
    });
})


// Worktimes table
// ------------------------------
// GET all worktimes
app.get("/worktimes", (req, res)=>{
    pool.query('SELECT * FROM worktimes', (error, results)=>{
        if (error) throw res.send(error);
        
        res.send(results)
    });
})

// GET all worktimes Between dates

// GET all worktimes by employee (ID)
app.get("/worktimes/:employee", (req, res)=>{
    let employee = req.params.employee
    pool.query(`SELECT * FROM worktimes WHERE ID=?`, employee, (error, results)=>{
        if (error) throw res.send(error);
        
        res.send(results)
    });
})

// GET all worktimes by employee between dates

// POST new worktimes
// PATCH one worktime by PK
// DELETE one worktime by PK
app.delete("/worktimes/:pk", (req, res)=>{
    let pk = req.params.pk
    pool.query(`DELETE FROM worktimes WHERE ID=?`, pk, (error, results)=>{
        if (error) throw res.send(error);
        
        res.send(results)
    });
})

app.listen(port, ()=>{
    console.log(`Server listenng on port: ${port}`)
})