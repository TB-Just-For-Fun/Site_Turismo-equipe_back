const Picture = require("../modules/picture");

const pictureController = {};

pictureController.create = async (res, req) => {
    try {
        const name = req.body;
        const file = req.file;

        const picture = new Picture({
            name,
            src: file.path,
        })

        await picture.save();

        res.json({ picture, message: "Imagem salva com sucesso!" })
    }
    catch (error) {
        return res.send("Erro ao fazer o upload da imagem!");
    }
}

module.exports = pictureController;
