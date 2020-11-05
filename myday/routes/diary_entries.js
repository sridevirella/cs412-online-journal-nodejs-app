const express = require('express')
const router = express.Router()
let moment = require('moment')
let entriesStore = require('../app').entriesStore

router.get('/add', async (req, res, next) => {
    try{
        res.render('add_entry',{
            isCreate: true,
            browserTitle: 'Add Page',
            pageHeading: 'Add An Entry',
            styles : ['/stylesheets/style.css'],
            isAddActive: 'active',
            entryKey: await entriesStore.count()
        })
    } catch (err) {
        next(err)
    }
})

router.post('/save', async (req, res, next) => {
    try{
        let entry;
        if(req.body.saveMethod === 'create')
         entry = await entriesStore.create(req.body.entryKey, req.body.day, req.body.title, req.body.body)
        else
            entry = await entriesStore.update(req.body.entryKey, req.body.day, req.body.title, req.body.body)

        res.redirect('/diary_entries/view?key=' + req.body.entryKey)
    } catch (err) {
        next(err)
    }
})

router.get('/viewAll', async (req, res, next) => {
    try{
        let allEntries = await entriesStore.findAllDairyEntries()

        res.render('view_all',
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

        let entry = await entriesStore.read(req.query.key)

        res.render('edit_entry', {
            isCreate: false,
            browserTitle: 'Edit Page',
            pageHeading: 'Edit an Entry',
            styles : ['/stylesheets/style.css'],
            entryKey: entry.key,
            entryDate: moment.utc(entry.date).format( 'YYYY-MM-DD'),
            entryTitle: entry.title,
            entryNote: entry.notes

        })
    } catch (err) {
        next(err)
    }
})

router.get('/view', async (req, res, next) => {
    try{
        let entry = await entriesStore.read(req.query.key)
        res.render('view_entry', {
            browserTitle: 'View Page',
            pageHeading: 'View an Entry',
            styles : ['/stylesheets/style.css'],
            entryKey: entry.key,
            entryDate: moment.utc(entry.date).format("YYYY MMM D (dddd)"),
            entryTitle: entry.title,
            entryNote: entry.notes
        })
    } catch (err) {
        next(err)
    }
})

router.get('/delete', async (req, res, next) =>{
    try{
        await entriesStore.destroy(req.query.key)
        res.redirect('/diary_entries/viewAll')
    } catch (err) {
        next(err)
    }
})
module.exports = router;