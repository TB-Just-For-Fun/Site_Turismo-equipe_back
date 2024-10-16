const mongoose = require('mongoose');
const pack = mongoose.Schema({
    nome_pacote:{
        type: String,
        unique: true,
        require: true,
    },
    actividades:{
        type: Array,
        require: true
    },
    duracao:{
        type: String,
        require: true
    },
    servicos:{
        type: Array,
        require: true,
    },
    preco:{
        type: Number,
        require: true
    },
    obs:{
        type: String,
        require: true
    }
});

module.exports = mongoose.model("pack", pack, "api_pacotes");