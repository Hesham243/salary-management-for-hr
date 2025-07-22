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

    res.render('employees/index.ejs', {foundEmployees: foundEmployees})

  } catch (error) {
    console.log(error)
    res.send('Something went wrong in listing all employees')
  }
})


// getting a specific employee from db then rendering him to employees/show.ejs
router.get('/:employeeId', async (req, res) => {
  try {
    const foundEmployee = await Employee.findById(req.params.employeeId).populate('user')

    res.render('employees/show.ejs', { foundEmployee })

  } catch (error) {
    console.log(error)
    res.redirect('/employees')
  }
})


// This route delete specific employee from db and redirect to view all employees
router.delete('/:employeeId', isSignedIn, async (req, res) => {
  try {
    const foundEmployee = await Employee.findById(req.params.employeeId).populate('user')
    
    if(foundEmployee.user._id.equals(req.session.user._id)) {
      await foundEmployee.deleteOne()
      return res.redirect('/employees')
    }
    return res.send('Not Authorized')

  } catch (error) {
    console.log(error)
    res.send('Something went wrong in deleting an employee')
  }
})


// getting a specific employee from db then rendering it to employees/edit.ejs
router.get('/:employeeId/edit', isSignedIn, async (req, res) => {
  try {
    const foundEmployee = await Employee.findById(req.params.employeeId).populate('user')
    
    if(foundEmployee.user._id.equals(req.session.user._id)) {
      return res.render('employees/edit.ejs', { foundEmployee: foundEmployee })
    }
    return res.send('Not Authorized')

  } catch (error) {
    console.log(error)
    res.send('Something went wrong')
  }
})


// updating employee information from db
router.put('/:employeeId', isSignedIn, async (req, res) => {
  try {
    const foundEmployee = await Employee.findById(req.params.employeeId).populate('user')
    
    if (foundEmployee.user._id.equals(req.session.user._id)) {
      const updatedEmployee = await Employee.findByIdAndUpdate(req.params.employeeId, req.body, { new: true })
      return res.redirect(`/employees/${req.params.employeeId}`)
    }
    return res.send('Not Authorized')

  } catch (error) {
    console.log(error)
    res.send('Something went wrong in updating an employee')
  }
})


module.exports = router