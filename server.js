const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");

const hostname = "127.0.0.1";
const port = 3000;

const mimeTypes = {
  html: "text/html",
  jpeg: "image/jpeg",
  jpg: "image/jpg",
  png: "image/png",
  js: "text/javascript",
  css: "text/css",
};

http
  .createServer((req, res) => {
    var uri = url.parse(req.url).pathname;
    var filename = path.join(process.cwd(), unescape(uri));

    var stats;

    try {
      stats = fs.statSync(filename);
    } catch (error) {
      res.writeHead(404, { "Content-type": "text/plain" });
      res.write("404 Not Found");
      res.end();
      return;
    }

    if (stats.isFile()) {
      var mimeType = mimeTypes[path.extname(filename).split(".").reverse()[0]];
      res.writeHead(200, { "Content-type": mimeType });

      var fileStream = fs.createReadStream(filename);
      fileStream.pipe(res);
    } else if (stats.isDirectory()) {
      res.writeHead(302, {
        Location: "index.html",
      });
    } else {
      res.writeHead(500, { "Content-type": "text/plain" });
      res.write("500 Internal Error");
    }
  })
  .listen(port, hostname, () => {
    console.log("Server Running");
  });
