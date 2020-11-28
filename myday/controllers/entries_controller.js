let DiaryEntry = require('../models/diary_entries').DiaryEntry
let moment = require('moment')
let {User} = require('../models/user')
const {body, validationResult} = require('express-validator')

exports.entryController = {

    add: async (req, res, next) => {
        if (req.isAuthenticated()) {
            try {
                res.render('diary_entries/add_entry', {
                    isCreate: true,
                    browserTitle: 'Add Page',
                    pageHeading: 'Add An Entry',
                    styles: ['/stylesheets/style.css'],
                    isAddActive: 'active',
                    maxDate: moment(new Date()).format('YYYY-MM-DD')
                })
            } catch (err) {
                next(err)
            }
        } else {
            req.flash('error', 'Please log in to access Diary')
            res.redirect('/users/login')
        }
    },
    viewAll: async (req, res, next) => {

        if(req.isAuthenticated()) {
            try {
                let entryIds = req.user.entries
                console.log('user entry Ids:', entryIds)
                let allEntries = await findAllDairyEntries(entryIds)

                res.render('diary_entries/view_all',
                    {
                        browserTitle: 'View All page',
                        pageHeading: 'All Diary Entries',
                        styles: ['/stylesheets/style.css'],
                        isViewAllActive: 'active',
                        entryList: allEntries
                    })
            } catch (err) {
                next(err)
            }
        } else {
            req.flash('error', 'Please log in to access Diary')
            res.redirect('/users/login')
        }
    },
    edit: async (req, res, next) => {
        if(req.isAuthenticated()) {
            try {
                let entry = await read(req.query.id)

                res.render('diary_entries/edit_entry', {
                    isCreate: false,
                    browserTitle: 'Edit Page',
                    pageHeading: 'Edit an Entry',
                    styles: ['/stylesheets/style.css'],
                    _id: entry._id,
                    entryDate: moment.utc(entry.date).format('YYYY-MM-DD'),
                    entryTitle: entry.title,
                    entryNote: entry.notes,
                    maxDate: moment(new Date()).format('YYYY-MM-DD')
                })
            } catch (err) {
                next(err)
            }
        } else {
            req.flash('error', 'Please log in to access Diary')
            res.redirect('/users/login')
        }
    },
    view: async (req, res, next) => {
        if(req.isAuthenticated()) {
            try {
                let entry = await read(req.query.id.trim())
                res.render('diary_entries/view_entry', {
                    browserTitle: 'View Page',
                    pageHeading: 'View an Entry',
                    styles: ['/stylesheets/style.css'],
                    _id: entry._id,
                    entryDate: moment.utc(entry.date).format("YYYY MMM D (dddd)"),
                    entryTitle: entry.title,
                    entryNote: entry.notes
                })
            } catch (err) {
                next(err)
            }
        } else {
            req.flash('error', 'Please log in to access Diary')
            res.redirect('/users/login')
        }
    },
    save: async(req, res, next) => {

        if(req.body.saveMethod === 'create')
            await create(req, res, next)
        else
            await update(req, res, next)
    },
    destroy: async(req, res, next) => {

        try {
             let entry = await DiaryEntry.findOneAndDelete({_id: req.query.id.trim()})

            req.user.entries.pull(entry.id.trim())
            req.user = await User.findByIdAndUpdate({_id: req.user.id.trim()}, {entries: req.user.entries}, {new: true})

            req.flash('success', `Title:${entry.title} diary entry deleted successfully`)
            res.redirect('/diary_entries/viewAll')

        }catch (err) {
            console.log(`Error deleting Diary Entry ${err.message}`)
            req.flash('error', `Failed to delete diary entry because ${err.message}`)
            res.redirect('/diary_entries/viewAll')
        }
    },
    search: async (req, res, next) => {
        if(req.isAuthenticated()) {

            res.render('diary_entries/search_entries', {
                browserTitle: 'Search Entries Page',
                pageHeading: 'Search Diary Entries',
                styles: ['/stylesheets/style.css'],
                isSearchActive: 'active',
                maxDate: moment(new Date()).format('YYYY-MM-DD')
            })
        } else {
            req.flash('error', 'Please log in to search diary entries')
            res.redirect('/users/login')
        }
    },
    find: async (req, res, next) => {

        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            req.flash('error', errors.array().map(e => e.msg + '</br>').join(''))
            res.redirect('/diary_entries/search')

        } else {
            try {
                let matchedEntries = await titleDateSearch(req)

                res.render('diary_entries/search_entries',
                    {
                        browserTitle: 'Search Entries Page',
                        pageHeading: 'Search Diary Entries',
                        styles: ['/stylesheets/style.css'],
                        isSearchActive: 'active',
                        entryList: matchedEntries
                    })

            }catch (err) {

                console.log(`Error retrieving Diary Entries for the word`)
                req.flash('error', `Failed retrieving Diary Entries for the word ${err.message}`)
                res.redirect('/diary_entries/search')
            }
        }
    },
    count: async() => {
        return await DiaryEntry.findAllDairyEntries().count()
    }
}
const read = async (id) => {

        let entry = await DiaryEntry.findOne({ _id: id})
        return entry
}

const findAllDairyEntries = async (entryIds) => {

    let entryPromises = entryIds.map(id => DiaryEntry.findOne({_id: id}))
    const entries = await Promise.all(entryPromises)

        return entries.map(entry => {

                return {
                    _id: entry._id,
                    date: moment.utc(entry.date).format("YYYY MMM D (dddd)"),
                    title: entry.title
                }
        })
}

const titleDateSearch = async (req) => {

    let allMatched

    if(req.body.searchWord !== null && req.body.searchDate === "") {

        let resultEntries =  await DiaryEntry.find({$text: {$search: req.body.searchWord}})
        allMatched = await resultEntries.filter(entry => req.user.entries.some( id => id.equals(entry._id)));
        req.flash('success', `Diary entries for the word ${req.body.searchWord} retrieved successfully`)
    }
    else if(req.body.searchWord === "" && req.body.searchDate !== null) {

        let finalDate = req.body.searchDate + "T00:00:00.000+00:00";
        allMatched = await DiaryEntry.find({date: finalDate})
        req.flash('success', `Diary entries for the date ${req.body.searchDate} retrieved successfully`)
    }

    return allMatched.map(entry => {
        return {
            _id: entry._id,
            date: moment.utc(entry.date).format("YYYY MMM D (dddd)"),
            title: entry.title
        }
    })
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
            req.user.entries.push(entry.id.trim())
            req.user = await User.findByIdAndUpdate({_id: req.user.id.trim()}, {entries: req.user.entries}, {new: true})

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
    return {
        date: body.day,
        title: body.title,
        notes: body.body
    }
}