const route = require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {
    create,
    get,
    getById,
    put,
    apagar,
    login,
    createAdmin
} = require('../controllers/user.controller');

// Rota de login
route.post("/login", login);

// Rotas públicas
route.post("/", create);

// Rotas protegidas
route.use(authMiddleware.verifyToken);

route.get("/", get);
route.get("/:id", getById);
route.put("/:id", put);
route.delete("/:id", apagar);
route.post('/create-admin', authMiddleware.verifyAdmin, createAdmin);

module.exports = route;
