var utils = require('./utilities')
var http = require('http');
const publicIp = require('public-ip');
const spawn = require('child_process').spawn;

// var setMacAddress = "EC:AD:B8:0A:BB:AD";
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


//Return response from the server
var server = http.createServer(function(req, res) {
  res.writeHead(200, {"Content-Type": "application/json"});
  console.log("Request received.");
  if(req.method == 'GET') {
  	console.log("GET");
  }
  if (req.method == 'POST') {
      var jsonString = '';

      req.on('data', function (data) {
          jsonString += data;
      });

      req.on('end', function () {
          console.log(JSON.parse(jsonString));
      });
  }
      var json = JSON.stringify({
        "MAC": setMacAddress
      });
  res.end(json);
});




var port = 8080;
server.listen(port);

//Display public ip of node program
publicIp.v4().then(ip => {
    console.log("");
    console.log("Server has started.");
    console.log(ip + ":" + port);
    console.log("");
});


//Runs the interval method to look for bluetooth connection
(function() {
  var timeout = setInterval(function() {
      searchBlueTooth();
    console.log(".");
  }, 5000);
})();
