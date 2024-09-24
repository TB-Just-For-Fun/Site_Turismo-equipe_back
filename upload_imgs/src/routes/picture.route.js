const express = require("express");
const router = express.Router();

const upload = require("../config/multer");

const pictureController = require("../controller/pictures.controller");

router.post("/upload",upload.single("file"), pictureController.create);

module.exports = router;
