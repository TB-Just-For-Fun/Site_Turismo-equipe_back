const mongoose = require("mongoose");

const Schema = mongoose.Schema

const pictureSchema = new Schema({
    name: { type: String, require: true },
    src: { type: String, require: true }
})

module.exports = mongoose.model("Pictures", pictureSchema);