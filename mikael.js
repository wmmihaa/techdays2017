/* eslint-disable no-console, spaced-comment */

// create an empty modbus client
//var ModbusRTU = require("modbus-serial");
var ModbusRTU = require("modbus-serial");
var client = new ModbusRTU();

var networkErrors = ["ESOCKETTIMEDOUT", "ETIMEDOUT", "ECONNRESET", "ECONNREFUSED"];
var options = {
    baudrate: 19200,
    parity: 'even',
    stopBits: 1,
    dataBits: 8 // alt 7
};
// open connection to a serial port
client.connectRTU("/dev/ttyXRUSB0", options)
//client.connectTCP("modbus.local", { port: 502 })
    .then(setClient)
    .then(function() {
        console.log("Connected"); })
    .catch(function(e) {
        if(e.errno) {
            if(networkErrors.includes(e.errno)) {
                console.log("we have to reconnect");
            }
        }
        console.log(e.message); });

function setClient() {
    // set the client's unit id
    // set a timout for requests default is null (no timeout)
    client.setID(1);
    client.setTimeout(1000);

    // run program
    readRegisters();
}

function readRegisters() {
    // read the 4 registers starting at address 5
    client.readHoldingRegisters(3059, 2)
        .then(function(d) {

            var myint = new Int16Array(2);
            myint[0] = d.buffer[0]; //msg.register[1];
            myint[1] = d.buffer[1]; //msg.register[0];

            var myfloat = new Float32Array( myint.buffer);
           
            console.log( myfloat );
            console.log("Reading complete: " + JSON.stringify(d));
            console.log('readInt32BE: ' + d.buffer.readInt32LE(0));
            console.log('');

            //console.log("Receive:", d.data); 
        })
        .catch(function(e) {
            console.log("ERROR: " + e.message); })
        .then(close);
}


function close() {
    client.close();
}