const express = require("express");
const mongo = require("./mongo");

const postData = require("./Router/Post");
const userData = require("./Router/Users");

const server = express();

// port number

const port = "3001";

//wrapping to async () with IIFE

(async () => {
  try {
    // mongoDB connect
    await mongo.connectDB();

    // parse req body string to json format

    server.use(express.json());

    //middle ware common  no url condtions

    server.use((req, res, next) => {
      console.log("common middle ware called");
      next();
    });

    // url /posts condtion pass the "/posts to before call back"
    server.use("/posts", postData);

    // /user middle ware

    server.use("/users", userData);

    //start the server;

    server.listen(port, () => {
      console.log(`server Started at ${port}`);
    });
  } catch (err) {
    console.log("Err here", err);
  }
})();
