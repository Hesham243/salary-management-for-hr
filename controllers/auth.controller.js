const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/user.js')


router.get('/', (req, res) => {
    res.send('does the auth route work?')
})

router.get('/sign-up', (req, res) => {
    res.render('auth/sign-up.ejs')
})

router.post('/sign-up', async (req, res) => {

    const userInDatabase = await User.findOne({ username: req.body.username })
    if (userInDatabase) {
        return res.send('Username already taken.')
    }

    const existingEmail = await User.findOne({ email: req.body.email })
    if (existingEmail) {
        return res.send('Email is already registered.')
    }

    if (req.body.password !== req.body.confirmPassword) {
        return res.send('Password and confirm password must match.')
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
    const newUser = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
    })

    req.session.user = {
        username: newUser.username,
        email: newUser.email,
        _id: newUser._id,
    }
    
    req.session.save(() => {
        res.redirect('/')
    })
})


router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in.ejs')
})


router.post('/sign-in', async (req, res) => {

    const userInDatabase = await User.findOne({ username: req.body.username })

    if (!userInDatabase) {
        return res.send('Login failed. Please try again.')
    }

    const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password)
    if(!validPassword) {
        return res.send('Login failed. Please try again.')
    }

    req.session.user = {
        username: userInDatabase.username,
        _id: userInDatabase._id,
    }

    req.session.save(() => {
        res.redirect('/')
    })
})


router.get('/sign-out', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})

module.exports = router