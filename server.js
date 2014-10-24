var express = require('express')
var port = process.env.PORT || 3000
var app = express()
var MongoClient = require('mongodb').MongoClient
var Bacon = require("baconjs")
var url = process.env["MONGOHQ_URL"] || "mongodb://localhost/turtleroy"

MongoClient.connect(url, function(err, conn) {
  if (err) {
    throw err
  }
  TurtleStore(conn, express)
})

function TurtleStore(conn, express) {
  var turtles = conn.collection("turtle")
  var randomstring = require("randomstring")

  app.get("/turtles", function(req, res) {
    sendResult(mongoFind({}), res)
  })
  app.get("/turtles/:author", function(req, res) {
    sendResult(mongoFind({"content.author": req.params.author}), res)
  })
  app.get("/turtle/:id", function(req, res) {
    sendResult(mongoFind({"id": req.params.id}).map(".0"), res)
  })
  app.get("/turtle/:author/:name", function(req, res) {
    sendResult(mongoFind({"content.author": req.params.author, "content.description": req.params.name}).map(".0"), res)
  })
  app.post("/turtle", function(req, res) {
    var data = {
      id: randomstring.generate(10),
      content: req.body,
      date: new Date()
    }
    sendResult(mongoPost(data).map(data), res)
  })
  function mongoPost(data) {
    return Bacon.fromNodeCallback(turtles, "insert", [data])
  }
  function mongoFind(query) {
    return Bacon.fromNodeCallback(turtles.find(query), "toArray")
  }
  function sendResult(resultE, res) {
    resultE.log("result")
    resultE.onError(res, "send")
    resultE.onValue(function(value) {
      if (value) {
        res.json(value)
      } else {
        res.status(404).send("Not found")
      }
    })
  }
}

app.use(express.compress())
app.use(express.json())
app.use('/', express.static(__dirname + '/src/main/webapp'))
app.listen(port)
