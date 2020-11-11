const express = require('express')
const router = express.Router()
let moment = require('moment')
const { entryValidations, entryController } = require('../controllers/entries_controller')

router.get('/add', async (req, res, next) => {
    try{
        console.log("time value:", moment.utc(new Date()).format( 'YYYY-MM-DD'))
        res.render('diary_entries/add_entry',{
            isCreate: true,
            browserTitle: 'Add Page',
            pageHeading: 'Add An Entry',
            styles : ['/stylesheets/style.css'],
            isAddActive: 'active',
            maxDate: moment(new Date()).format( 'YYYY-MM-DD')
        })
    } catch (err) {
        next(err)
    }
})

router.post('/save', entryValidations, async (req, res, next) => {

    await entryController.save(req, res, next)
})

router.get('/viewAll', async (req, res, next) => {
    try{
        let allEntries = await entryController.findAllDairyEntries()

        res.render('diary_entries/view_all',
            { browserTitle: 'View All page',
                     pageHeading: 'All Diary Entries',
                     styles : ['/stylesheets/style.css'],
                     isViewAllActive: 'active',
                     entryList: allEntries})
    } catch (err) {
        next(err)
    }
})

router.get('/edit', async (req, res, next) => {
    try{

        let entry = await entryController.read(req.query.id)

        res.render('diary_entries/edit_entry', {
            isCreate: false,
            browserTitle: 'Edit Page',
            pageHeading: 'Edit an Entry',
            styles : ['/stylesheets/style.css'],
            _id: entry._id,
            entryDate: moment.utc(entry.date).format( 'YYYY-MM-DD'),
            entryTitle: entry.title,
            entryNote: entry.notes,
            maxDate: moment(new Date()).format( 'YYYY-MM-DD')
        })
    } catch (err) {
        next(err)
    }
})

router.get('/view', async (req, res, next) => {
    try{
        let entry = await entryController.read(req.query.id)
        res.render('diary_entries/view_entry', {
            browserTitle: 'View Page',
            pageHeading: 'View an Entry',
            styles : ['/stylesheets/style.css'],
            _id: entry._id,
            entryDate: moment.utc(entry.date).format("YYYY MMM D (dddd)"),
            entryTitle: entry.title,
            entryNote: entry.notes
        })
    } catch (err) {
        next(err)
    }
})

router.get('/delete', async (req, res, next) =>{

    await entryController.destroy(req, res, next)
})
module.exports = router;