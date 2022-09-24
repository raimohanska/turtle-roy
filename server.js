var express = require("express");
var port = process.env.PORT || 8070;
var app = express();
var MongoClient = require("mongodb").MongoClient;
var mongoUrl = process.env["MONGO_URI"] || "mongodb://localhost/turtleroy";
var TurtleStore = require("./turtlestore");

MongoClient.connect(mongoUrl, function (err, conn) {
  if (err) {
    throw err;
  }
  TurtleStore(conn, app);
});

app.use(express.compress());
app.use(express.json());
app.use("/", express.static(__dirname + "/public"));
app.use("/", express.static(__dirname + "/output"));
app.use("/codemirror", express.static(__dirname + "/node_modules/codemirror"));
app.use("/components", express.static(__dirname + "/bower_components"));
app.listen(port);

console.log("Listening on port", port);
