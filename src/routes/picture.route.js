const express = require("express");
const router = express.Router();

const upload = require("../config/multer");

const pictureController = require("../controllers/pictures.controller");

router.post("/upload", upload.single("file"), pictureController.create);
router.get("/imagens", pictureController.findAll);
router.delete("/:id", pictureController.remove);

module.exports = router;
