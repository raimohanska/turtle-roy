var express = require('express')
var port = process.env.PORT || 8070
var app = express()
var MongoClient = require('mongodb').MongoClient
var mongoUrl = process.env["MONGOHQ_URL"] || "mongodb://localhost/turtleroy"
var TurtleStore = require("./turtlestore")
console.log("load bt")
var blueTurtle = require("./bluetooth-turtle.js")
console.log("loaded")

MongoClient.connect(mongoUrl, function(err, conn) {
  if (err) {
    throw err
  }
  TurtleStore(conn, app)
})

app.use(express.compress())
app.use(express.json())
app.use('/', express.static(__dirname + '/public'))
app.use('/', express.static(__dirname + '/output'))
app.use('/components', express.static(__dirname + '/bower_components'))
app.listen(port)

app.post("/robomove", function(req, res) {
  var command = req.body.command
  var param = req.body.param
  console.log("got command", command, param)
  var formattedCommand = command.substring(0,1) + param
  blueTurtle.send(formattedCommand)
  res.json({sent: true})
})
