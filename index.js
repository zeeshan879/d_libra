const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3000;

const postRouter = require("./route.js");

// static resources should just be served as they are
app.use(
  express.static(path.resolve(__dirname, "./build"))
);
app.use(
    express.urlencoded({
      extended: true,
    })
  );
  
app.use(express.json())
app.use(postRouter);

app.listen(PORT, (error) => {
  if (error) {
    return console.log("Error during app startup", error);
  }
  console.log("listening on " + PORT + "...");
});
