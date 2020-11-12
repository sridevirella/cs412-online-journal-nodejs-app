const express = require('express')
const router = express.Router()
const { registerValidations, loginValidations, userController } = require('../controllers/user_controller')

router.get('/register', async (req, res, next) => {
    await userController.register(req, res, next)
})

router.post('/register', registerValidations, async (req, res, next) => {
    await userController.create(req, res, next)
})

router.get('/login', async (req, res, next) => {
    await userController.login(req, res, next)
})

router.post('/login', loginValidations, async (req, res, next) => {
    await userController.authenticate(req, res, next)
})

module.exports = router