const Picture = require("../models/picture");

exports.create = async (res, req) => {
    try {
        const { name } = req.body;
        const file = req.files;

        console.log(req.body);
        //verificação do nome do ficheiro
        if (!name) {
            return res.status(400).send("Nome do ficheiro não recebido!");
        }
        //verificação do ficheiro
        if (!file) {
            return res.status(400).send("Ficheiro não recebido!");
        }

        //objecto responsável por salvar a imagem
        const picture = new Picture({
            name,
            src: file.path,
        })

        await picture.save();

        res.json({ picture, message: "Imagem salva com sucesso!" });
    }
    catch (error) {
        console.log("Houve um erro ao carregar a imagem: ", error);
    }
}
