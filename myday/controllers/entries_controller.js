let DiaryEntry = require('../models/diary_entries').DiaryEntry
let moment = require('moment')
const {body, validationResult} = require('express-validator')

exports.entryController = {

    save: async(req, res, next) => {

        if(req.body.saveMethod === 'create')
            await create(req, res, next)
        else
            await update(req, res, next)
    },
    read: async (id) => {

        let entry = await DiaryEntry.findOne({ _id: id})
        return entry
    },
    findAllDairyEntries: async () => {

        const entries = await DiaryEntry.find({})

        return entries.map(entry => {
            return {
                _id: entry._id,
                date: moment.utc(entry.date).format("YYYY MMM D (dddd)"),
                title: entry.title
            }
        })
    },
    destroy: async(req, res, next) => {

        try {
             let entry = await DiaryEntry.findOneAndDelete({_id: req.query.id})
             req.flash('success', `${entry.title} diary entry deleted successfully`)
             res.redirect('/diary_entries/viewAll')

        }catch (err) {
            console.log(`Error deleting Diary Entry ${err.message}`)
            req.flash('error', `Failed to delete diary entry because ${err.message}`)
            res.redirect('/diary_entries/viewAll')
        }
    },
    count: async() => {
        return await DiaryEntry.findAllDairyEntries().count()
    }
}

const create = async (req, res, next) => {

    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        req.flash('error', errors.array().map(e => e.msg + '</br>').join(''))
        res.redirect('/diary_entries/add')

    } else {
        try {
            let entryParams = getEntryParams(req.body)
            let entry = new DiaryEntry(entryParams)
            await entry.save()

            req.flash('success', `Title:${entry.title}, diary entry added successfully`)
            res.redirect('/diary_entries/view?id=' + entry._id)

        }catch (err) {

            console.log(`Error saving Diary Entry ${err.message}`)
            req.flash('error', `Failed to add diary entry because ${err.message}`)
            res.redirect('/diary_entries/add')
        }
    }
}

const update = async (req, res, next) => {

    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        req.flash('error', errors.array().map(e => e.msg + '</br>').join(''))
        res.redirect('/diary_entries/edit?id=' +req.body.entryId)

    } else {
        try {
            let entryParams = getEntryParams(req.body)

            let entry = await DiaryEntry.findOneAndUpdate({_id: req.body.entryId}, {
                date: entryParams.date,
                title: entryParams.title,
                notes: entryParams.notes
            })

            req.flash('success', `Title:${entry.title}, diary entry updated successfully`)
            res.redirect('/diary_entries/view?id=' + req.body.entryId)

        }catch (err) {

            console.log(`Error editing Diary Entry ${err.message}`)
            req.flash('error', `Failed to edit diary entry because ${err.message}`)
            res.redirect('/diary_entries/edit?id=' +req.body.entryId)
        }
    }
}

exports.entryValidations = [

    body('day')
        .notEmpty().withMessage('Date is required'),
    body('title')
        .notEmpty().withMessage('Title is required')
]

const getEntryParams = body => {
    console.log('here body:', body)
    return {
        date: body.day,
        title: body.title,
        notes: body.body
    }
}