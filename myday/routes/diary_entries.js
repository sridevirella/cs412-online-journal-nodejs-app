const express = require('express')
const router = express.Router()
let entriesStore = require('../app').entriesStore

router.get('/add', async (req, res, next) => {
    try{
        res.render('add_entry',{
            isCreate: true,
            browserTitle: 'Add Page',
            pageHeading: 'Add an Entry',
            styles : ['/stylesheets/style.css'],
            entryKey: await entriesStore.count()
        })
    } catch (err) {
        next(err)
    }
})

router.post('/save', async (req, res, next) =>{
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
        let keyList = await entriesStore.keyList()
        //List of promises for each key
        let keyPromises = keyList.map(key => {
            return entriesStore.read(key)
        })
        let allEntries = await Promise.all(keyPromises)

        res.render('view_all',
            { browserTitle: 'View All page',
                     pageHeading: 'All Diary Entries',
                     styles : ['/stylesheets/style.css'],
                     entryList: extractNotesToLiteral(allEntries)})
    } catch (err) {
        next(err)
    }
})

function extractNotesToLiteral(allEntries) {
    return allEntries.map(entry => {
            return {
                key: entry.key,
                date: entry.date,
                title: entry.title
            }
        })
}

router.get('/edit', async (req, res, next) => {
    try{

        let entry = await entriesStore.read(req.query.key)
        console.log("notes::",entry.notes)
        res.render('edit_entry', {
            isCreate: false,
            browserTitle: 'Edit Page',
            pageHeading: 'Edit an Entry',
            styles : ['/stylesheets/style.css'],
            entryKey: entry.key,
            entryDate: entry.date,
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
            entryDate: entry.date,
            entryTitle: entry.title,
            entryNote: entry.notes

        })
    } catch (err) {
        next(err)
    }
})

router.get('/delete', async (req, res, next) => {
    try{
        let entry = await entriesStore.read(req.query.key)
        res.render('delete_entry', {
            browserTitle: 'Delete Page',
            pageHeading: 'Delete an Entry',
            styles : ['/stylesheets/style.css'],
            entryKey: entry.key,
            entryDate: entry.date,
            entryTitle: entry.title,
            entryNote: entry.notes
        })
    } catch (err) {
        next(err)
    }
})

router.post('/remove', async (req, res, next) =>{
    try{
        await entriesStore.destroy(req.query.key)
        res.redirect('/diary_entries/viewAll')
    } catch (err) {
        next(err)
    }
})
module.exports = router;