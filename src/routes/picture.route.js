const express = require("express");
const router = express.Router();

const upload = require("../Config/multer");

const pictureController = require("../controllers/pictures.controller");

router.post("/upload", upload.single("file"), pictureController.create);
router.get("/imagens", pictureController.findAll);
router.get("/imagem", pictureController.findByName);
router.get("/imagens/provincia", pictureController.findByProvincia);
router.patch("/alterar/:id", pictureController.update)
router.delete("/:id", pictureController.remove);

module.exports = router;
