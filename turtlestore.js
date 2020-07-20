var Bacon = require("baconjs")
var randomstring = require("randomstring")

function TurtleStore(conn, app) {
  var turtles = conn.db().collection("turtle")

  app.get("/gallery", function(req, res) {
    sendResult(mongoFind({
      "content.preview": { $exists: true }
    }), res)
  })

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
    return Bacon.fromNodeCallback(turtles.find(query).limit(100).sort({date: -1}), "toArray")
  }
  function sendResult(resultE, res) {
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

module.exports = TurtleStore
