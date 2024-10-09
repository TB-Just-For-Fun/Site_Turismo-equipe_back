const Picture = require("../models/picture");

const fs = require("fs");

exports.create = async (req, res) => {
    try {
        const { name } = req.body;

        const file = req.file;

        const picture = new Picture({
            name,
            src: file.path
        });

        await picture.save();

        res.json({ picture, msg: "Imagem salva com sucesso!" });
    }
    catch (error) {
        res.status(500).json({ message: "Erro ao enviar a imagem:", error });
    }
}

exports.findAll = async (req, res) => {
    try {
        const pictures = await Picture.find();

        res.json(pictures);
    }
    catch (erro) {
        res.status(500).send({ message: "Erro ao buscar imagem!" });
        console.log(erro);
    }
}

exports.remove = async (req, res) => {
    try {
        const picture = await Picture.findById(req.params.id);

        if (!picture) {
            return res.status(404).json({ message: "Imagem não encontrada!" })
        }

        fs.unlinkSync(picture.src);

        await picture.deleteOne();

        res.status(200).json({ message: "Imagem removida com sucesso!" });

    }
    catch (error) {
        res.status(500).send("Houve um erro ao apagar a imagem!");
        console.log(error);
    }
}