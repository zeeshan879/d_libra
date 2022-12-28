const express = require("express");
const path = require("path");
const fs = require("fs");
const https = require("https");

const app = express.Router();

app.get("*", (request, response, next) => {
  // console.log("utf8", request.path);

  const filePath = path.resolve(__dirname, "./build", "index.html");

  fs.readFile(filePath, "utf8", function (err, data) {
    if (request.path.startsWith("/topic")) {
      // console.log(request.path.startsWith("/topic"));
      // console.log(request.path);

      let baseurl = "https://api.libraa.ml/media/";
      const topicname = request.path.split("/")[2];
      const topic = topicname.split("_")[1]
      const meta =
        request.path.split("/")[6] === undefined
          ? "meta description"
          : request.path.split("/")[6];
      const image = request.path.split("/")[7];
      url = baseurl + image.replaceAll("%7C", "/");

      // console.log(url);
      // console.log(topic);
      // console.log(meta);


      // let img = "";
      // let imgSvg = "";
      // if (request.path) {
      //   img = baseurl + url.split("svg")[0] + "png";
      //   imgSvg = baseurl + url;
      // } 

      // var buffers = [];
      // function href2base64(img) {
      //   return new Promise(function (resolve, reject) {
      //     https.get(img).on("response", function (r) {
      //       r.on("data", function (data) {
      //         buffers.push(data);
      //       }).on("end", function () {
      //         resolve(
      //           `data:${r.headers["content-type"]};base64,${Buffer.concat(
      //             buffers
      //           ).toString("base64")}`
      //         );
      //       });
      //     });
      //   });
      // }

      //   fs.readFile(buffers, function(err, data) {
      //     var base64data = new Buffer(data).toString('base64');
      //     console.log(base64data)
      //  });

      data = data
        .replace("<title>React App</title>", `<title>${topic}</title>`)
        .replace("__META_OG_TITLE__", topic)
        .replace("__META_OG_DESCRIPTION__", meta)
        .replace("__META_DESCRIPTION__", meta)
        .replace("__META_OG_IMAGE__", url);
      // .replace(
      //   "__META_OG_IMAGE__",
      //   "https://api.libraa.ml/media/Users/logo192.png"
      // );

      response.send(data);
    }
  });
});

module.exports = app;
