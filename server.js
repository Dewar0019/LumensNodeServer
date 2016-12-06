var express = require('express');
var bodyParser = require("body-parser");
var app = express();
var unirest = require('unirest');
var utils = require('./utilities')
var wamp = require('./wamp')
var async = require("async");

const publicIp = require('public-ip');
const spawn = require('child_process').spawn;

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


app.get('/', function(req, res) {
    console.log("got a GET request for the homepage");
    res.send(JSON.stringify({
        success: 200
    }));
})


app.post('/updateMe', function(req, res) {
    console.log("got a POST request for the homepage");
    console.log("Lists of registered devices:");
    console.log(req.body);
    res.send(JSON.stringify({
        success: 200
    }));
})


app.post('/setLightLevel', function(req, res) {
    console.log("Updating Light Level");
    if (utils.isEmpty(req.body)) {
        res.statusCode = 500;
        console.log("Incorrect JSON request")
        res.send(JSON.stringify({
            error: "Incorrect JSON request"
        }));
        return;
    }
    var json = req.body;
    for (obj in req.body) {
        wamp.setLightLevel(obj, json[obj].active_level);
    }
    res.send(JSON.stringify({
        success: 200
    }));
})


app.get('/getLightLevel', function(req, res) {
    console.log("Getting Light Level");
    async.series([
            function(callback) {
                wamp.getLightLevels("left", callback)
            },
            function(callback) {
                wamp.getLightLevels("right", callback)
            },
            function(callback) {
                wamp.getLightLevels("back", callback)
            }
        ],
        function(err, results) {
            console.log(results)
            res.send(JSON.stringify({
                results
            }));
        })
})

var server = app.listen(8081, function() {
    var host = server.address().address
    var port = server.address().port

    //Sending post request to update the list of registered devices
    // var retrieveDevices = function() {
    //     unirest.post('http://192.168.1.82:8080/getStatus')
    //         .type('json')
    //         .send({
    //             deviceName: 'volen118'
    //         })
    //         .end(function(response) {
    //             if (response.body !== undefined) {
    //                 setMacAddress = response.body;
    //                 foundAddress = new Set();
    //             }
    //         });
    // }



    //Display public ip of node program
    publicIp.v4().then(ip => {
        console.log("");
        console.log("Server has started.");
        console.log(ip + ":" + port);
        console.log("");
    });


    var setMacAddress = {
        dewarsWatch: 'EC:AD:B8:0A:BB:AD'
    };
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
            for (obj in setMacAddress) {
                console.log(obj);
                if (!foundAddress.has(setMacAddress[obj])) {
                    console.log("Searching for address: " + setMacAddress[obj]);
                    searchBlueTooth(setMacAddress[obj]);
                }
            }
        }, 5000);

        var retriever = setInterval(function() {
            // retrieveDevices();
            console.log("Retrieving lists of registered devices");
        }, 1000000);
    })();
})