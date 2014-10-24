var express = require('express')
var port = process.env.PORT || 3000
var app = express()
var MongoClient = require('mongodb').MongoClient
var url = process.env["MONGOHQ_URL"] || "mongodb://localhost/turtleroy"
var TurtleStore = require("./turtlestore")

MongoClient.connect(url, function(err, conn) {
  if (err) {
    throw err
  }
  TurtleStore(conn, app)
})

app.use(express.compress())
app.use(express.json())
app.use('/', express.static(__dirname + '/src/main/webapp'))
app.listen(port)
