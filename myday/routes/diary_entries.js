const express = require('express')
const router = express.Router()
let moment = require('moment')
const { entryValidations, entryController } = require('../controllers/entries_controller')

router.get('/add', async (req, res, next) => {
    await entryController.add(req, res, next)
})

router.post('/save', entryValidations, async (req, res, next) => {
    await entryController.save(req, res, next)
})

router.get('/viewAll', async (req, res, next) => {
    await entryController.viewAll(req, res, next)
})

router.get('/edit', async (req, res, next) => {
    await  entryController.edit(req, res, next)
})

router.get('/view', async (req, res, next) => {
    await entryController.view(req, res, next)
})

router.get('/delete', async (req, res, next) =>{
    await entryController.destroy(req, res, next)
})

router.get('/search', async (req, res, next) =>{
    await entryController.search(req, res, next)
})

router.post('/search/find', async (req, res, next) =>{
    await entryController.find(req, res, next)
})

module.exports = router;