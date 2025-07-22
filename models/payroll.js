const mongoose = require('mongoose')
const Schema = mongoose.Schema

const  payrollSchema = new Schema({
  pay_date: Date,
  hours_worked: Number,
  bonus: Number,
  total_salary: Number,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  employee: {
    type: Schema.Types.ObjectId,
    ref: 'Employee'
  }
}, { timestamps: true }) 

module.exports = mongoose.model('Payroll', payrollSchema)
