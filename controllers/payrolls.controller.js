const express = require('express')
const router = express.Router()
const isSignedIn = require('../middleware/is-signed-in')
const Payroll = require('../models/payroll')

router.get('/:employeeId/new', (req, res) => {
  res.render('payrolls/new.ejs', { employeeId: req.params.employeeId })
})

// router.post('/:employeeId', isSignedIn, async (req, res) => {
//   req.body.user = req.session.user._id
//   req.body.employee = req.params.employeeId
//   const createPayroll = await Payroll.create(req.body)
//   res.redirect(`/payrolls/${req.params.employeeId}/${createPayroll._id}`)
// })
router.post('/:employeeId', isSignedIn, async (req, res) => {
  req.body.user = req.session.user._id
  req.body.employee = req.params.employeeId
  const createPayroll = await Payroll.create(req.body)
  res.redirect(`/payrolls/${req.params.employeeId}`)
})

// router.get('/:employeeId/:payrollId', async (req, res) => {
//   const foundPayroll = await Payroll.findById(req.params.payrollId).populate('user').populate('employee')
//   res.render('payrolls/show.ejs', {foundPayroll: foundPayroll})
// })

router.get('/:employeeId', async (req, res) => {
  console.log(req.params.employeeId)
  const foundPayrolls = await Payroll.find().populate('user').populate('employee')
  console.log(foundPayrolls)
  res.render('payrolls/index.ejs', {foundPayrolls: foundPayrolls})

})




module.exports = router