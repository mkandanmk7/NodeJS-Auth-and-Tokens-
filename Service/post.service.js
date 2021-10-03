const { ObjectId } = require("mongodb"); //driver

const db = require("../mongo"); // mongo db connection

service = {
  async getData(req, res) {
    // console.log(req.user);
    try {
      // find   make it as array : toArray()
      const getData = await db.posts
        .find({ userId: req.user.userId })
        .toArray(); // use toArray( ) spl for find( ) query

      // console.log(gestData);
      res.send(getData); // make it as array;   data to fEnd;
    } catch (err) {
      res.sendStatus(500); // send error status;
    }
  },
  async postData(req, res) {
    console.log(req.user);
    try {
      const { insertedId: _id } = await db.posts.insertOne({
        ...req.body,
        userId: req.user.userId,
      });

      console.log("created New data");
      //insert
      res.send({ ...req.body, _id });
    } catch (err) {
      console.log("Error for create pOst", err);
      res.sendStatus(500);
    }
  },

  async deleteData(req, res) {
    try {
      //check userID and _id is same:

      const post = await db.posts.findOne({
        _id: ObjectId(req.params.id),
        userId: req.user.userId,
      });
      // post not belongs to user
      if (!post) {
        return res.status(401).send({ error: "Access Denied for You...!" });
      }

      console.log("Delete id is :", req.params.id);
      // deleteOne
      await db.posts.deleteOne({ _id: ObjectId(req.params.id) });
      res.send({});
    } catch (err) {
      res.sendStatus(500);
    }
  },
  async updateData(req, res) {
    try {
      //check userID and _id is same:

      const post = await db.posts.findOne({
        _id: ObjectId(req.params.id),
        userId: req.user.userId,
      });
      // post not belongs to user
      if (!post) {
        return res.status(401).send({ error: "Access Denied for You...!" });
      }

      // console.log(req.params.id); // its string but _id: is Object(id)
      console.log("Updated id is :", req.params.id);
      await db.posts.findOneAndUpdate(
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
