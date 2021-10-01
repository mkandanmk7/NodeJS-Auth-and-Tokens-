const userApi = require("express").Router(); //for Routes

// const { ObjectId } = require("mongodb"); //driver

const service = require("../Service/user.service");

//post Api Routes;
// get methods

userApi.get("/", service.getData);

userApi.delete("/:id", service.deleteData);

userApi.post("/", service.postData);

userApi.put("/:id", service.updateData);

module.exports = userApi;
