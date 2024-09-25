const multer = require("multer");

const path = require("path");

//objecto que contém o destino e a função para nomear os arquivos enviados
const storage = multer.diskStorage({
    destination: function (res, file, cb) {
        cb(null, "upload/")
    },
    filename: function (res, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage });

module.exports = upload;
