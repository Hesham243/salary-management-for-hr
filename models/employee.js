const mongoose = require('mongoose')
const Schema = mongoose.Schema

// const  payrollSchema = new Schema({
//   pay_date: Date,
//   hourse_worked: Number,
//   bonus: Number,
//   total_salary: Number,
//   user: {
//     type: Schema.Types.ObjectId,
//     ref: 'User'
//   }
// }, { timestamps: true }) 


const employeeSchema = new Schema({
  name: String,
  position: String,
  salary: Number,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  // payrolls: [payrollSchema]
}, { timestamps: true })


module.exports = mongoose.model('Employee', employeeSchema)
