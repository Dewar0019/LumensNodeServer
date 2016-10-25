var express = require('express');
var bodyParser = require("body-parser");
var app = express();
const publicIp = require('public-ip');
var utils = require('./utilities')
const spawn = require('child_process').spawn;

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/',function  (req, res) {
   console.log("got a GET request for the homepage");
   res.send('hello GET');
})
app.post('/',function  (req, res) {
   console.log("got a POST request for the homepage");
   var device_name = req.body.device;
   var mac_add = req.body.macAdd
   res.send('hello POST');
})


var server = app.listen(8081, function() {
   var host = server.address().address
   var port = server.address().port

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


function searchBlueTooth() {
  const deploySh = spawn('sh', [ 'bt.sh' ], {
    cwd: '/home/csfp/Desktop/LumenServer',
    env: Object.assign({}, process.env, { PATH: process.env.PATH + ':/usr/local/bin' })
  });

  //Results of the script
  deploySh.stdout.on('data', (data) => {
    //Remove linebreak at end of string
    var returnStatus = (`${data}`).replace(/(\r\n|\n|\r)/gm,"");
    console.log(returnStatus);
    if(returnStatus == "RSSI") {
      setMacAddress.push(`${data}`);
      setMacAddress = setMacAddress.filter(utils.unique);
	console.log("HELLO!");
    }
  });
}

//Runs the interval method to look for bluetooth connection
(function() {
  var timeout = setInterval(function() {
      searchBlueTooth();
    console.log(".");
  }, 5000);
})();
})
