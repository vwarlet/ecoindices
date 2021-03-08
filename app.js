var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var http = require('http');
var path = require("path");
var bodyParser = require('body-parser');
var helmet = require('helmet');
var rateLimit = require("express-rate-limit");


var app = express();
var server = http.createServer(app);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 999999999 // limit each IP to 100 requests per windowMs
});


var db = new sqlite3.Database('./database/Database.db');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'./public')));
app.use(helmet());
app.use(limiter);
/*
db.run('CREATE TABLE IF NOT EXISTS Posts(id INTEGER PRIMARY KEY UNIQUE NOT NULL AUTOINCREMENT, titulo VARCHAR NOT NULL, \
                                         postagem TEXT NOT NULL, data VARCHAR NOT NULL');
*/
app.get('/', function(req,res){
  res.sendFile(path.join(__dirname,'./public/index.html'));
});


// Criar Nova Postagem
app.post('/add', function(req,res){
  db.serialize(()=>{
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;

    db.run('INSERT INTO Posts(titulo,postagem,data) VALUES(?,?,?)', [req.body.titulo, req.body.postagem, today], function(err) {
      if (err) {
        return console.log(err.message);
      }

      res.redirect('./admin/manager.html');
    });
  });
});

// Alterar Postagem
app.post('/update', function(req,res){
  db.serialize(()=>{
    db.run('UPDATE Posts SET titulo = ?, postagem = ?', [req.body.titulo, req.body.postagem], function(err){
      if(err){
        res.send("Error encountered while updating");
        return console.error(err.message);
      }

      res.redirect('./admin/manager.html');
    });
  });
});

// Excluir Postagem
app.post('/delete', function(req,res){
  db.serialize(()=>{
    db.run('DELETE FROM Posts WHERE id = ?', req.body.id, function(err) {
      if (err) {
        res.send("Error encountered while deleting");
        return console.error(err.message);
      }
      res.redirect('./admin/manager.html');
    });
  });

});

//Não estou usando, para ver 1 postagem buscando pelo ID
// View
app.post('/view', function(req,res){
  db.serialize(()=>{
    db.each('SELECT id, titulo, postagem, data FROM Posts WHERE id = ?', [req.body.id], function(err,row){     //db.each() is only one which is funtioning while reading data from the DB
      if(err){
        res.send("Error encountered while displaying");
        return console.error(err.message);
      }
      res.send({ID: row.id, Título: row.titulo, Postagem: row.postagem, Data: row.data});
      //res.redirect("news.html");
    });
  });
});


// Cria um JSON com os dados do banco
app.get('/rows', function (req, res) {
  db.all('SELECT * FROM Posts', function(err, rows, fields)   
  {  
      if (err) throw err;  

      res.json(rows); 
  });
});


/***** Scraping dos Índices Econômicos *****/
const cheerio = require('cheerio')
const axios = require('axios')

axios.get('https://www.valor.srv.br/index.php').then((response) => {
 
  const $ = cheerio.load(response.data)
  const urlElems = $('ul.ulIndices a')
  const urlText = [];
    
  for (let i = 0; i < urlElems.length; i++) {
    const urlA = $(urlElems[i]);   
    
    if (urlA)
      urlText.push($(urlA).text());
    
  }
  //console.log(urlText);

  // Transformar em JSON 
  app.get('/indices', function (req, res) {
    res.json(urlText); 
  });
});
/******************************************/


// Closing the database connection.
app.get('/close', function(req,res){
  db.close((err) => {
    if (err) {
      res.send('There is some error in closing the database');
      return console.error(err.message);
    }
    console.log('Closing the database connection.');
    res.send('Database connection successfully closed');
  });

});



server.listen(3000, function(){
  console.log("server is listening on port: 3000");
});
