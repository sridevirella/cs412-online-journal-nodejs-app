let DiaryEntry = require('./diary_entries').DiaryEntry
let AbstractEntriesStore = require('./diary_entries').AbstarctEntriesStore

let entries = []
exports.InMemoryEntriesStore = class InMemoryEntriesStore extends AbstractEntriesStore {

    async close() { }

    async update(key, date, title, notes) {

        entries[key].date = date
        entries[key].title = title
        entries[key].notes = notes
        return entries[key]
    }

    async create(key, date, title, notes) {

        entries[key] = new DiaryEntry(key, date, title, notes)
        return entries[key]
    }

    async read(key) {

        if (entries[key])
            return entries[key]
        else
            throw new Error(`Entry for ${key} does not exist`)
    }

    async destroy(key) {

        if( entries[key]) {
            delete entries[key]
        }

        else
            throw new Error(`Entry for ${key} does not exist`)
    }

    async keyList() {
        return Object.keys(entries)
    }

    async count() {
        return entries.length
    }

}