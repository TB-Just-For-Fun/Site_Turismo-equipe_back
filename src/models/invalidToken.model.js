const mongoose = require('mongoose');

const InvalidTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  invalidatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('InvalidToken', InvalidTokenSchema);
