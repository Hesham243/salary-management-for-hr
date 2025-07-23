const mongoose = require('mongoose')
const Schema = mongoose.Schema

const employeeSchema = new Schema({
  name: String,
  position: String,
  salary: Number,
  image: {
    url: { type: String, required: true },
    cloudinary_id: { type: String, required: true}
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
}, { timestamps: true })


module.exports = mongoose.model('Employee', employeeSchema)
