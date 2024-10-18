const route = require("express").Router();
const {
    create,
    get,
    put,
    apagar,
    getById
} = require("../controllers/pack.controller");

route.post("/", create);
route.get("/pacotes", get);
route.get("/:id", getById);
route.put("/:id", put);
route.delete("/:id", apagar);

module.exports = route;