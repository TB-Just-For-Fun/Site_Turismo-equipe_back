const route = require("express").Router();
const {authMiddleware} = require("../middlewares/auth.middleware");
const {
    create,
    get,
    patch,
    apagar,
    getById
} = require("../controllers/pack.controller");


//rotas públicas
route.get("/pacotes", get);
route.get("/:id", getById);

//rotas privadas
route.use(authMiddleware.verifyToken);
route.post("/", create);
route.patch("/:id", patch);
route.delete("/:id", apagar);

module.exports = route;