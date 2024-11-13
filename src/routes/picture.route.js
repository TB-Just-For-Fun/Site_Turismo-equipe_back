const express = require("express");
const router = express.Router();
const {authMiddleware} = require("../middlewares/auth.middleware");

const upload = require("../Config/multer");

const pictureController = require("../controllers/pictures.controller");

//rotas públicas
router.get("/imagens", pictureController.findAll);
router.get("/imagem/", pictureController.findByName);
router.get("/imagens/provincia", pictureController.findByProvincia);

//rotas privadas
router.use(authMiddleware.verifyToken);
router.post("/upload", upload.single("file"), pictureController.create);
router.patch("/alterar/:id", pictureController.update)
router.delete("/:id", pictureController.remove);

module.exports = router;
