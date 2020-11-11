const express = require('express')
const router = express.Router()
const { registerValidations, loginValidations, userController } = require('../controllers/user_controller')

router.get('/register', async (req, res, next) => {

    res.render('users/register', {
        browserTitle: 'Sign Up Page',
        pageHeading: 'Sign Up',
        styles: ['/stylesheets/style.css'],
        isRegisterActive: 'active'
    })
})

router.post('/register', registerValidations, async (req, res, next) => {

    await userController.create(req, res, next)
})

router.get('/login', async (req, res, next) => {

    res.render('users/login', {
        browserTitle: 'Login Page',
        pageHeading: 'Login',
        styles: ['/stylesheets/style.css'],
        isLoginActive: 'active'
    })
})

router.post('/login', loginValidations, async (req, res, next) => {
    await userController.authenticate(req, res, next)
})

module.exports = router