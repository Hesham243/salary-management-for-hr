const express = require('express')
const router = express.Router()
const isSignedIn = require('../middleware/is-signed-in')
const Employee = require('../models/employee')

// get the user new form to add employee
router.get('/new', (req, res) => {
  res.render('employees/new.ejs') 
})

// post the new employee to the db
router.post('/', isSignedIn, async (req, res) => {
  try {
    req.body.user = req.session.user._id
    const createdEmployee = await Employee.create(req.body)
    console.log('This is the employee added to DB:', createdEmployee)
    res.redirect('/employees')

  } catch (error) {
    console.log(error)
    res.send('Something went wrong in posting an employee')
  }
})

//  getting all employees from db and rendering them in employees.index.ejs
router.get('/', async (req, res) => {
  try {
    const foundEmployees = await Employee.find()
    console.log('These are founded employess in DB:', foundEmployees)
    res.render('employees/index.ejs', {foundEmployees: foundEmployees})
  } catch (error) {
    console.log(error)
    res.send('Something went wrong in viewing all employees')
  }
})

// getting a specific employee from db then rendering him to employees/show.ejs
router.get('/:employeeId', async (req, res) => {
  try {
    const foundEmployee = await Employee.findById(req.params.employeeId).populate('user')
    res.render('employees/show.ejs', { foundEmployee })
    console.log("This is the specific employee from db:", foundEmployee)
  } catch (error) {
    console.log(error)
    res.redirect('/employees')
  }
})


// This route delete specific employee from db and redirect to view all employees
router.delete('/:employeeId', isSignedIn, async (req, res) => {
  const foundEmployee = await Employee.findById(req.params.employeeId).populate('user')
  
  if(foundEmployee.user._id.equals(req.session.user._id)) {
    await foundEmployee.deleteOne()
    console.log('This is the deleted employee from db:', foundEmployee)
    return res.redirect('/employees')
  }
  return res.send('Not Authorized')
})


router.get('/:employeeId/edit', isSignedIn, async (req, res) => {
  const foundEmployee = await Employee.findById(req.params.employeeId).populate('user')

  if(foundEmployee.user._id.equals(req.session.user._id)) {
    return res.render('employees/edit.ejs', { foundEmployee: foundEmployee })
  }
  return res.send('Not Authorized')
})


router.put('/:employeeId', isSignedIn, async (req, res) => {
  const foundEmployee = await Employee.findById(req.params.employeeId).populate('user')

  if (foundEmployee.user._id.equals(req.session.user._id)) {
    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.employeeId, req.body, { new: true })
    console.log('This is the updated employee from db:', updatedEmployee)
    return res.redirect(`/employees/${req.params.employeeId}`)
  }

  return res.send('Not Authorized')
})


module.exports = router