const multer = require("multer");
const path = require("path");
const firebase = require('firebase/app');
const { getStorage, ref, uploadBytesResumable } = require('firebase/storage');
const storageConfig = require('./firebase.config'); // Importando a configuração do Firebase

const upload = multer({
    storage: multer.memoryStorage(), // Armazena o arquivo em memória temporariamente
    fileFilter: (req, file, cb) => {
        // Adicione filtros para os tipos de arquivos permitidos
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

module.exports = upload;
