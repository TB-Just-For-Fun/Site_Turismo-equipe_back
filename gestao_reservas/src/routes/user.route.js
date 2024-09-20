const route = require('express').Router();
const userController = require('../controllers/user.controller'); 

route.post("/", userController.create); 
route.get("/", userController.get); 
route.get("/:id", userController.getById);
route.put("/:id", userController.put); 
route.delete("/:id", userController.apagar);

module.exports = route;
