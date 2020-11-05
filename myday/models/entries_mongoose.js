let DiaryEntry = require('./diary_entries').DiaryEntry
let AbstractEntriesStore = require('./diary_entries').AbstarctEntriesStore
let moment = require('moment')

exports.MongooseEntriesStore = class MongooseEntriesStore extends AbstractEntriesStore {

    async update(key, date, title, notes) {

        let entry = await DiaryEntry.findOneAndUpdate({key: key}, {
            date: date,
            title: title,
            notes: notes
        })
        return entry
    }

    async create(key, date, title, notes) {

        let entry = new DiaryEntry({
            key: key,
            date: date,
            title: title,
            notes: notes
        })
        entry = await entry.save()
        return entry
    }

    async read(key) {

        const entry = await DiaryEntry.findOne({ key: key})
        return entry
    }

    async destroy(key) {

        await DiaryEntry.findOneAndDelete({key: key})
    }

    async findAllDairyEntries() {

        const entries = await DiaryEntry.find({})

        return entries.map(entry => {
            return {
                key: entry.key,
                date: moment.utc(entry.date).format("YYYY MMM D (dddd)"),
                title: entry.title
            }
        })
    }

    async count() {
       return Date.now() + Math.random()
    }
}