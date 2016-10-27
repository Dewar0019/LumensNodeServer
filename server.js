var express = require('express');
var bodyParser = require("body-parser");
var app = express();
var unirest = require('unirest');
const publicIp = require('public-ip');
var utils = require('./utilities')
const spawn = require('child_process').spawn;

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


app.get('/', function(req, res) {
    console.log("got a GET request for the homepage");
    res.send('hello GET');
})
app.post('/updateMe', function(req, res) {
    console.log("got a POST request for the homepage");
    console.log("Lists of registered devices:");
    console.log(req.body);
    res.send('success');
})


var server = app.listen(8081, function() {
    var host = server.address().address
    var port = server.address().port

    //Sending post request to update the list of registered devices
    var retrieveDevices = function() {
        unirest.post('http://192.168.1.82:8080/getStatus')
            .type('json')
            .send({
                deviceName: 'volen118'
            })
            .end(function(response) {
                if (response.body !== undefined) {
                    setMacAddress = response.body;
					foundAddress = new Set();
                }
            });
    }



    //Display public ip of node program
    publicIp.v4().then(ip => {
        console.log("");
        console.log("Server has started.");
        console.log(ip + ":" + port);
        console.log("");
    });




    // var setMacA
    // var timeout = setInterval(fuddress = "EC:AD:B8:0A:BB:AD";
    var setMacAddress = [];
	var foundAddress = new Set();

    function searchBlueTooth(macAddress) {

            const deploySh = spawn('sh', ['bt.sh', macAddress], {
                cwd: '/home/csfp/Desktop/LumenServer',
                env: Object.assign({}, process.env, {
                    PATH: process.env.PATH + ':/usr/local/bin'
                })
            });

            //Results of the script
            deploySh.stdout.on('data', (data) => {
                //Remove linebreak at end of string
                var returnStatus = (`${data}`).replace(/(\r\n|\n|\r)/gm, "");
                console.log(returnStatus);
                if (returnStatus == "RSSI") {
                    console.log("Found " + macAddress + " nearby");
					foundAddress.add(macAddress);
                }
            });
        
    }

    //Runs the interval method to look for bluetooth connection
    (function() {
        var timeout = setInterval(function() {
			for(var i =0; i<setMacAddress.length;i++) {
				if(!foundAddress.has(setMacAddress[i])) {
					console.log("Searching for address: " +setMacAddress[i]);
            		searchBlueTooth(setMacAddress[i]);
				}
			}

            console.log(".");
        }, (5000 * setMacAddress.length) + 1000);

        var retriever = setInterval(function() {
            retrieveDevices();
            console.log("Retrieving lists of registered devices");
            console.log(".");
        }, 10000);
    })();
})
