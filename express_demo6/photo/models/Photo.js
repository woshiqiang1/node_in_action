const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/photo_app',  { useNewUrlParser: true })

let schema = new mongoose.Schema({
  name: String,
  path: String
})
module.exports = mongoose.model('Photo', schema)