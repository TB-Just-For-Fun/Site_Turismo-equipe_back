const { default: mongoose } = require("mongoose");
const packModel = require("../models/pack");
const packController = {}

//Método get para retornar um array com todos pacotes
packController.get = async (req, res) => {
    try {
        const { } = req.query;

        const pacotes = await packModel.find();

        if (pacotes.length < 1) {
            res.status(200).send("Não há pacotes disponíveis!")
        }
        else {
            return res.status(200).send(pacotes);
        }
    }
    catch (error) {
        console.log(error);
        return res.status(400).send({ message: "Ocorreu um erro!", error: error })
    }
};

//método getById para retornar um pacote específico pelo id
packController.getById = async (req, res) => {
    const { id } = req.params;

    const pacote = await packModel.findOne({ _id: id });

    if (!pacote) {
        return res.status(404).send("Pacote não encontrado!")
    }
    res.status(200).send(pacote);
};

//rota de criação de pacotes com o método post
packController.create = async (req, res) => {

    if (req.user.role !== "administrador" && req.user.role !== "administrador_supremo") {
        res.status(401).send("Acesso negado!")
    }

    const { nome_pacote, actividades, duracao, servicos, preco, obs } = req.body;

    if (!nome_pacote || !actividades || !duracao || !servicos || !preco || !obs) {
        res.status(400).send({ message: "Todos os campos são obrigatórios!" });
    }

    try {
        const pacoteExiste = await packModel.findOne({ nome_pacote });
        
        if (pacoteExiste) {
            res.status(400).json({
                message: "Já existe um pacote com esse nome!",
            });
        }

        const packInstance = await packModel.create({
            ...req.body
        })

        res.status(200).send({
            message: "Pacote criado com sucesso!",
            pack: {
                nome_pacote,
                actividades,
                duracao,
                servicos,
                preco,
                obs
            },
        });
    } catch (error) {
        console.log("Erro ao cadastrar pacote: ",error);
    }
};

packController.patch = async (req, res) => {

    if (req.user.role !== "administrador" && req.user.role !== "administrador_supremo") {
        res.status(401).send("Acesso negado!")
    }

    const { id } = req.params;
    try {
        const updatePack = await packModel.findByIdAndUpdate(id, req.body, { new: true });

        res.status(200).json(updatePack);
    }
    catch (error) {
        console.log("Ocorreu um erro: ", error);
    }
};

packController.apagar = async (req, res) => {

    if (req.user.role !== "administrador" && req.user.role !== "administrador_supremo") {
        res.status(401).send("Acesso negado!")
    }

    const { id } = req.params;

    const pacote = await packModel.deleteOne({ _id: id });

    return res.status(201).send(pacote);
};


module.exports = packController;