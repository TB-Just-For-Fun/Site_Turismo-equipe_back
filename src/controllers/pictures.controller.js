const firebase = require('firebase/app');
const { getStorage, ref, uploadBytesResumable } = require('firebase/storage');
const { deleteObject } = require('firebase/storage');
const firebaseConfig = require('../Config/firebase.config'); // Caminho para o seu arquivo de configuração

const Picture = require("../models/picture");
const fs = require("fs");

// Inicialize o Firebase
firebase.initializeApp(firebaseConfig);
const storage = getStorage(firebase.app);

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const { description } = req.body;
    const file = req.file;

    // Gerar nome único para o arquivo
    const filename = `${Date.now()}${file.originalname.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
    const storageRef = ref(storage, `images/${filename}`);

    // Upload da imagem para o Firebase Storage
    const uploadTask = uploadBytesResumable(storageRef, file.buffer, {
      contentType: file.mimetype
    });

    uploadTask.on('state_changed',
      (snapshot) => {
        // ... (opcional: lidar com o progresso do upload)
      },
      (error) => {
        console.error('Erro ao fazer o upload:', error);
        res.status(500).json({ message: "Erro ao enviar a imagem:", error });
      },

      async () => {
        // Upload concluído
        const baseURL = "https://firebasestorage.googleapis.com/v0/b/justforfun-28d85.appspot.com/o/images%2F"
        const downloadURL = `${baseURL}${(await uploadTask).metadata.name}?alt=media`;

        if (!name || !description || !file) {
          res.status(400).send({ message: "Todos os campos são obrigatórios!" });
        }
        else {
          const picture = new Picture({
            name,
            description,
            src: downloadURL, // URL da imagem no Firebase Storage
          });

          await picture.save();

          res.json({ picture, msg: "Imagem salva com sucesso!" });
        }
      }
    );

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao enviar a imagem:", error });
  }
};

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
      return res.status(404).json({ message: "Imagem não encontrada!" });
    }

    // Referência para o arquivo no Firebase Storage
    const storage = getStorage();
    const desertRef = ref(storage, picture.src);

    // Deleta o arquivo
    await deleteObject(desertRef);

    // Remove a entrada do banco de dados
    await picture.deleteOne();

    res.status(200).json({ message: "Imagem removida com sucesso!" });
  } catch (error) {
    res.status(500).send("Houve um erro ao apagar a imagem!");
    console.log(error);
  }
};

exports.findByName = async (req, res) => {
  const { name } = req.query;

  try {
      const pictures = await Picture.find({ name: { $regex: new RegExp(name, 'i') } });

      if (pictures.length < 1) {
          res.status(404).send("Imagem não encontrada!");
      } else {
          res.status(200).json({ message: "Imagens encontradas: ", pictures });
      }
  } catch (error) {
      res.status(500).send("Ocorreu um erro ao buscar imagem!")
      console.log("Erro ao buscar imagens: ", error)
  }
};

exports.findByProvincia = async (req, res) => {
  const { provincia } = req.query;

  try {
      const pictures = await Picture.find({ provincia: { $regex: new RegExp(provincia, 'i') } });

      if (pictures.length < 1) {
          res.status(404).send("Imagens não encontradas!");
      } else {
          res.status(200).json({ message: "Imagens encontradas: ", pictures });
      }
  } catch (error) {
      res.status(500).send("Ocorreu um erro ao buscar imagem!")
      console.log("Erro ao buscar imagens: ", error)
  }
};

exports.update = async (req, res) => {
  const {id} = req.params;
  try {
    const UpdatePicture = await Picture.findByIdAndUpdate(id, req.body, {new: true});

    res.status(200).json(UpdatePicture);
  }
  catch(error){
    console.log("Ocorreu um erro: ", error);
  }
};