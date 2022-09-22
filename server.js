var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer(function (req, res) {
  let filename;
  if (req.url.includes(".js")) {
    var q = url.parse(req.url, true);
    filename = "." + q.pathname; 
  } else {
    filename = "./index.html"
  }  
  fs.readFile(filename, function(err, data) {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    }
    if (req.url == "/") {
      res.writeHead(200, {'Content-Type': 'text/html'});
    } else {
      res.writeHead(200, {'Content-Type': 'application/json'}); // this might not help anything
    } 
    res.write(data);
    return res.end();
  });
}).listen(8080);
