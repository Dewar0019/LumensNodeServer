//$ npm install --save public-ip


var http = require('http');
const publicIp = require('public-ip');
const spawn = require('child_process').spawn;

// var setMacAddress = "EC:AD:B8:0A:BB:AD";
var setMacAddress = [];


function searchBlueTooth() {
  const deploySh = spawn('sh', [ 'bt.sh' ], {
    cwd: '/Users/DewarTan/Desktop/LumensNodeServer',
    env: Object.assign({}, process.env, { PATH: process.env.PATH + ':/usr/local/bin' })
  });

  deploySh.stdout.on('data', (data) => {
    //Remove linebreak at end of string
    var returnStatus = (`${data}`).replace(/(\r\n|\n|\r)/gm,"");
    console.log(returnStatus);
    if(returnStatus == "Not Found") {
      console.log("Found!");
      setMacAddress.push(`${data}`);
      setMacAddress = setMacAddress.filter(unique);
    }
  });
}

var unique = function(elem, pos,arr) {
  return arr.indexOf(elem) == pos;
};

var server = http.createServer(function(req, res) {
  res.writeHead(200, {"Content-Type": "application/json"});
  console.log("Request received.");
  var json = JSON.stringify({
    "MAC": setMacAddress
  });
  res.end(json);
});




var port = 8080;
server.listen(port);

publicIp.v4().then(ip => {
    console.log("");
    console.log("Server has started.");
    console.log(ip + ":" + port);
    console.log("");
});


(function() {
  var timeout = setInterval(function() {
      searchBlueTooth();
    console.log("Interval");
  }, 5000);
})();