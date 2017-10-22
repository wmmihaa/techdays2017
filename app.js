
// ...
var SerialPort = require('serialport');
var nmea = require('nmea');
var Readline = SerialPort.parsers.Readline;
var port = new SerialPort('/dev/ttyS4');
var parser = port.pipe(new Readline({ delimiter: '\r\n' }));

port.pipe(parser);                 
console.log('PARSER DONE');

parser.on('data', function(line){ 
    console.log('LINE: ' + line);
    gpsData = nmea.parse(line);
}); 