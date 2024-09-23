const route = require("express").Router();
const {
    create,
    get,
    put,
    apagar,
    getById
} = require("../controllers/pack.controller");

route.post("/", create);
route.get("/", get);
route.get("/:id", getById);
route.put("/", put);
route.delete("/", apagar);

module.exports = route;