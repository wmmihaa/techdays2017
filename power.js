var ModbusRTU = require("modbus-serial");
var client = new ModbusRTU();

var serialPortPath = "/dev/ttyXRUSB0";
var slaveAdress = 1;
var registerAdress = 3058;
var registerSize = 2;

var options = {
    baudrate: 19200,
    parity: 'even',
    stopBits: 1,
    dataBits: 8 // alt 7
};

// open connection to a serial port 
client.connectRTUBuffered(serialPortPath, options, function (err) {
    if (err) {
        console.log('ERROR: ' + err);
    }
    else {
        console.log("CONNECTED!");
        client.setID(1);
        setTimeout(function () {
            readRegister();

        }, 1000);
    }
});

function readRegister() {
    console.log('Trying to read register...');

    setInterval(function () {
        client.readHoldingRegisters(registerAdress, registerSize, function (err, data) {
            if (err) {
                console.log("ERROR: " + JSON.stringify(err));
            }
            else {
                var myint = new Int16Array(2);

                myint[0] = data.data[0];
                myint[1] = data.data[1];

                var myfloat = new Float32Array(myint.buffer);

                console.log(myfloat[0] * 1000 + " W");
                console.log('');

            }
        });
    }, 1000);

}