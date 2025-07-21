const express = require('express')
const router = express.Router()
const isSignedIn = require('../middleware/is-signed-in')

// NEW Employee FORM

router.get('/new', (req, res) => {
  res.render('employees/new.ejs') 
})


module.exports = router