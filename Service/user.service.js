const { ObjectId } = require("mongodb"); //driver
const bcrypt = require("bcrypt");
const db = require("../mongo"); // mongo db connection
const jwt = require("jsonwebtoken");

service = {
  async registerUser(req, res) {
    try {
      const newUser = await db.users.findOne({ email: req.body.email });
      // console.log(data);
      if (newUser) {
        return res.status(400).send({ error: "user Exist already" });
      }

      //genSalt create random strings
      const salt = await bcrypt.genSalt(10);

      // hash (two params : our pass , random string )

      req.body.password = await bcrypt.hash(req.body.password, salt); // it will stored in db;

      // else insert the user to db;

      await db.users.insertOne(req.body);
      console.log("User registerd");

      res.send("registerd");

      // res.send({ ...req.body, _id});
    } catch (err) {
      console.log("error is registering", err);
      res.sendStatus(500);
    }
  },
  async loginUser(req, res) {
    try {
      const user = await db.users.findOne({ email: req.body.email });
      if (!user) {
        res.status(400).send("Users doesn't exist");
      }

      // compare (our pass, and hash) check password is same or not
      const isValid = await bcrypt.compare(req.body.password, user.password);
      if (!isValid) {
        return res
          .status(403)
          .send({ Error: "Email or Password is incorrect" });
      }

      // jwt sign(two param : {json: unique id}, "password");
      const authToken = jwt.sign(
        { userId: user._id, email: user.email },
        "muthu@123"
      ); // generates tokens for parti- user accessing api;

      res.send({ Token: authToken });
    } catch (err) {
      console.log("error is Loggin", err);
      res.sendStatus(500);
    }
  },

  async getData(req, res) {
    try {
      // find  make it as array : toArray()
      const getData = await db.users.find().toArray(); // use toArray( ) spl for find( ) query

      console.log(getData);
      res.send(getData); // make it as array;   data to fEnd;
    } catch (err) {
      res.sendStatus(500); // send error status;
    }
  },
  async postData(req, res) {
    try {
      const { insertedId: _id } = await db.users.insertOne(req.body);

      console.log("created New data");
      //insert
      res.send({ ...req.body, _id });
    } catch (err) {
      res.sendStatus(500);
    }
  },

  async deleteData(req, res) {
    try {
      console.log("Delete id is :", req.params.id);
      // deleteOne
      await db.users.deleteOne({ _id: ObjectId(req.params.id) });
      res.send({});
    } catch (err) {
      res.sendStatus(500);
    }
  },
  async updateData(req, res) {
    try {
      // console.log(req.params.id); // its string but _id: is Object(id)
      console.log("Updated id is :", req.params.id);
      await db.users.findOneAndUpdate(
        { _id: ObjectId(req.params.id) },
        { $set: { ...req.body } },
        { ReturnDocument: "after" }
      );
      // console.log(data);
      res.send({ ...req.body, id: req.params.id });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  },
};
module.exports = service;
