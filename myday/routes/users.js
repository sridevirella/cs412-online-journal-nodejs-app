const express = require('express')
const router = express.Router()
const { registerValidations, loginValidations, profileValidations, userController } = require('../controllers/user_controller')

router.get('/register', async (req, res, next) => {
    await userController.register(req, res, next)
})

router.post('/save', registerValidations, async (req, res, next) => {
    await userController.save(req, res, next)
})

router.get('/profile', async (req, res, next) => {
    await userController.profile(req, res, next)
})

router.post('/profile/save', profileValidations, async (req, res, next) => {
    await userController.save(req, res, next)
})

router.post('/profile/changePassword', async (req, res, next) =>{
    await userController.changePassword(req, res, next)
})

router.get('/login', async (req, res, next) => {
    await userController.login(req, res, next)
})

router.post('/login', loginValidations, async (req, res, next) => {
    await userController.authenticate(req, res, next)
})

router.get('/logout', async (req, res) => {
      await userController.logout(req, res)
})
module.exports = router