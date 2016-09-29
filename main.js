//$ npm install --save public-ip

var http = require('http');
const publicIp = require('public-ip');

var server = http.createServer(function(req, res) {
  console.log("Request received.");
  res.writeHead(200, {"Content-Type": "application/json"});
  var otherArray = ["success1", "success2"];
  var otherObject = { item1: "success1val", item2: "success2val" };
  var json = JSON.stringify({
    anObject: otherObject,
    anArray: otherArray,
    another: "item"
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
