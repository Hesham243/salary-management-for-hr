const upload = require('../config/multer')
const cloudinary = require('../config/cloudinary')

const express = require('express')
const router = express.Router()
const isSignedIn = require('../middleware/is-signed-in')
const Employee = require('../models/employee')


// get the user new form to add employee
router.get('/new', (req, res) => {
  res.render('employees/new.ejs') 
})


// post the new employee to the db
router.post('/', isSignedIn,  upload.single('image'), async (req, res) => {
  try {
    req.body.user = req.session.user._id
    req.body.image = {
      url: req.file.path,
      cloudinary_id: req.file.filename
    }
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
    const foundEmployees = await Employee.find({user: req.session.user._id})
    
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
     
    if (!foundEmployee.user._id.equals(req.session.user._id)) {
      return res.redirect(`/employees`)
    }

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
 
    if (!foundEmployee.user._id.equals(req.session.user._id)) {
      return res.redirect(`/employees`)
    }

    if (foundEmployee.image?.cloudinary_id) {
      await cloudinary.uploader.destroy(foundEmployee.image.cloudinary_id)
    }

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

     
    if (!foundEmployee.user._id.equals(req.session.user._id)) {
      return res.redirect(`/employees`)
    }

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
    
    if (!foundEmployee.user._id.equals(req.session.user._id)) {
      return res.redirect(`/employees`)
    }

    if (foundEmployee.user._id.equals(req.session.user._id)){ 
      if (req.file && foundEmployee.image?.cloudinary_id) {
        await cloudinary.uploader.destroy(foundEmployee.image.cloudinary_id)
        foundEmployee.image.url = req.file.path
        foundEmployee.image.cloudinary_id = req.file.filename
      }

      foundEmployee.name = req.body.name
      foundEmployee.position = req.body.position
      foundEmployee.salary = req.body.salary

      await foundEmployee.save()
      return res.redirect(`/employees/${req.params.employeeId}`)
      
    }

    return res.send('Not Authorized')

  } catch (error) {
    console.log(error)
    res.send('Something went wrong in updating an employee')
  }
})


module.exports = router