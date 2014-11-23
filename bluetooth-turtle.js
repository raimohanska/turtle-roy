var btSerial = new (require('bluetooth-serial-port')).BluetoothSerialPort();
var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

btSerial.on('found', function(address, name) {
    console.log("Found", address, name)
    btSerial.findSerialPortChannel(address, function(channel) {
        btSerial.connect(address, channel, function() {
            console.log('Connected');
            btSerial.on('data', handleResponse);
        }, function () {
            console.log('cannot connect');
        });

        // close the connection when you're ready
        btSerial.close();
    }, function() {
        console.log('Did not find serial port on device');
    });
});
console.log("Discovering...")
btSerial.inquire();
var buffer = ""

function sendCommand(command) {
  console.log("Sending", command)
  btSerial.write(new Buffer(command+"\n", 'ascii'), function(err, bytesWritten) {
      if (err) console.log("Error writing", err);
  });
}


function handleResponse(inBuffer) {
  inStr =  inBuffer.toString('utf-8')
  buffer += inStr
  if (buffer[buffer.length-1] == "\n") {
    var response = buffer
    buffer = ""
    console.log(response)
  }
}

module.exports = {
  send: function(command) {
    sendCommand(command)
  }
}
