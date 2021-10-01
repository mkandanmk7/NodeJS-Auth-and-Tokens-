const postApi = require("express").Router(); //for Routes

const service = require("../Service/post.service");

//post Api Routes;
// get methods

postApi.get("/", service.getData);

postApi.delete("/:id", service.deleteData);

postApi.post("/", service.postData);

postApi.put("/:id", service.updateData);

module.exports = postApi;
