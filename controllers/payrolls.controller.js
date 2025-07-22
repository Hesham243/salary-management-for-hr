const express = require('express')
const router = express.Router()
const isSignedIn = require('../middleware/is-signed-in')
const Payroll = require('../models/payroll')

router.get('/:employeeId/new', (req, res) => {
  res.render('payrolls/new.ejs', { employeeId: req.params.employeeId })
})


router.post('/:employeeId', isSignedIn, async (req, res) => {
  req.body.user = req.session.user._id
  req.body.employee = req.params.employeeId
  const createPayroll = await Payroll.create(req.body)
  res.redirect(`/payrolls/${req.params.employeeId}`)
})


router.get('/:employeeId', async (req, res) => {
  console.log(req.params.employeeId)
  const foundPayrolls = await Payroll.find().populate('user').populate('employee')
  console.log(foundPayrolls)
  res.render('payrolls/index.ejs', {foundPayrolls: foundPayrolls})

})


router.delete('/:employeeId/:payrollId', isSignedIn, async (req, res) => {
  const foundPayroll = await Payroll.findById(req.params.payrollId).populate('user').populate('employee')
  if (foundPayroll.user._id.equals(req.session.user._id)){
    await foundPayroll.deleteOne()
    console.log('This is the deleted payroll from db:', foundPayroll)
    return res.redirect(`/payrolls/${req.params.employeeId}`)
  }else {
    res.send('Not Authorized')
  }
})


router.get('/:employeeId/:payrollId/edit',isSignedIn , async (req, res) => {
  const foundPayroll = await Payroll.findById(req.params.payrollId).populate('user').populate('employee')
  if (foundPayroll.user._id.equals(req.session.user._id)){
    return res.render('payrolls/edit.ejs', {foundPayroll: foundPayroll})
  } else {
    res.send('Not Authorized')
  }
})


router.put('/:employeeId/:payrollId', isSignedIn, async (req, res) => {
  const foundPayroll = await Payroll.findById(req.params.payrollId).populate('user').populate('employee')
  if (foundPayroll.user._id.equals(req.session.user._id)){
    const updatedPayroll = await Payroll.findByIdAndUpdate(req.params.payrollId, req.body, { new: true })
    console.log('This is the updated payroll from db:', updatedPayroll)
    return res.redirect(`/payrolls/${foundPayroll.employee._id}`)
  } else {
    return res.send('Not Authorized')
  }
})


module.exports = router