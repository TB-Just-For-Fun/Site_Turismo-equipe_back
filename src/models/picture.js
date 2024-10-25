const mongoose = require("mongoose");

const Schema = mongoose.Schema

const pictureSchema = new Schema({
    name: { type: String, require: true },
    description: { type: String, require: true },
    src: { type: String, require: true },
    CreatedAt: { type: Date, default: Date.now },
    UpdatadedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Picture", pictureSchema);
