const upload = require('../config/multer')
const cloudinary = require('../config/cloudinary')
const express = require('express')
const router = express.Router()
const isSignedIn = require('../middleware/is-signed-in')
const Payroll = require('../models/payroll')


router.get('/:employeeId/new', isSignedIn, (req, res) => {
  res.render('payrolls/new.ejs', { employeeId: req.params.employeeId })
})


router.post('/:employeeId', isSignedIn, async (req, res) => {
  try {
    req.body.user = req.session.user._id
    req.body.employee = req.params.employeeId

    const createPayroll = await Payroll.create(req.body)

    res.redirect(`/payrolls/${req.params.employeeId}`)

  } catch (error) {
    console.log(error)
    res.send('Something went wrong posting payroll in db')
  }
})


router.get('/:employeeId', isSignedIn, async (req, res) => {
  try {
    const foundPayrolls = await Payroll.find({ employee: req.params.employeeId }).populate('user').populate('employee')
    
    foundPayrolls.forEach( (payroll) => {
      if (!payroll.user._id.equals(req.session.user._id)) {
        return res.send('Oops. Dont you know its not allowed to see others data???')
      }
    })

    res.render('payrolls/index.ejs', { payrolls: foundPayrolls })

  } catch (error) {
    console.log(error)
    res.send('Something went wrong in listing all payroll')    
  }
})


router.delete('/:employeeId/:payrollId', isSignedIn, async (req, res) => {
  try {
    const foundPayroll = await Payroll.findById(req.params.payrollId).populate('user').populate('employee')

    if (foundPayroll.user._id.equals(req.session.user._id)){
      await foundPayroll.deleteOne()
      return res.redirect(`/payrolls/${req.params.employeeId}`) 
        
    }else {
      res.send('Not Authorized')
    }

  } catch (error) {
    console.log(error)
    res.send('Something went wrong deleting a payroll')    
  }
})


router.get('/:employeeId/:payrollId/edit',isSignedIn , async (req, res) => {
  try {
    const foundPayroll = await Payroll.findById(req.params.payrollId).populate('user').populate('employee')

    if (foundPayroll.user._id.equals(req.session.user._id)){
      return res.render('payrolls/edit.ejs', {foundPayroll: foundPayroll})

    } else {
      res.send('Not Authorized')
    }

  } catch (error) {
    console.log(error)
    res.send('Something went wrong')
  }
})


router.put('/:employeeId/:payrollId', isSignedIn, async (req, res) => {
  try {
    const foundPayroll = await Payroll.findById(req.params.payrollId).populate('user').populate('employee')

    if (foundPayroll.user._id.equals(req.session.user._id)){
      const updatedPayroll = await Payroll.findByIdAndUpdate(req.params.payrollId, req.body, { new: true })
      return res.redirect(`/payrolls/${foundPayroll.employee._id}`)

    } else {
      return res.send('Not Authorized')
    }

  } catch (error) {
    console.log(error)
    res.send('Something went wrong')
  }
})


module.exports = router