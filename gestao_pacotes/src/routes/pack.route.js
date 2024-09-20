const route = require("express").Router();
const {
    create,
    get,
    put,
    apagar,
    getByName
} = require("../controllers/pack.controller");

route.post("/", create);
route.get("/", get);
route.get("/", getByName);
route.put("/", put);
route.delete("/", apagar);

module.exports = route;