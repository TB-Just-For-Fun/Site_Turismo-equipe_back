const jwt = require('jsonwebtoken');

const authMiddleware = {};

authMiddleware.verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).send({ message: "Token não fornecido" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).send({ message: "Token inválido" });
    }
};

// Middleware para verificar se o usuário é administrador
authMiddleware.verifyAdmin = (req, res, next) => {
    if (req.user.role !== 'administrador') {
        return res.status(403).send({ message: "Acesso negado. Apenas administradores." });
    }
    next();
};

module.exports = authMiddleware;
