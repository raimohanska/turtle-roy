var express = require('express')
var port = process.env.PORT || 3000
var app = express()

app.use(express.compress())
app.use(express.json())
app.use('/', express.static(__dirname + '/src/main/webapp'))
app.use('/', express.static(__dirname + '/bower_components/blockly'))
app.listen(port)
