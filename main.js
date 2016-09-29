//$ npm install --save public-ip


var http = require('http');
const publicIp = require('public-ip');
const { spawn } = require('child_process')





var setMacAddress = "EC:AD:B8:0A:BB:AD";


var server = http.createServer(function(req, res) {
  console.log("Request received.");
  res.writeHead(200, {"Content-Type": "application/json"});
 // var otherArray = ["success1", "success2"];
  //var otherObject = { item1: "success1val", item2: "success2val" };


//deploySh.stdout.on('data', (data) => {
//console.log("hi")
 // console.log(`${data}`);
//});
spawn('sh', [ 'bt.sh' ], {
  cwd: '/home/csfp/Desktop/LumenServer',
  env: Object.assign({}, process.env, { PATH: process.env.PATH + ':/usr/local/bin' })
})

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
