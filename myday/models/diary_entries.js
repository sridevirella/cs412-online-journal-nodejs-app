const _entry_key = Symbol('key')
const _entry_date = Symbol('date')
const _entry_title = Symbol('title')
const _entry_notes = Symbol('notes')

exports.DiaryEntry = class DiaryEntry {

    constructor(key, date, title, notes) {

        this[_entry_key] = key
        this[_entry_date] = date
        this[_entry_title] = title
        this[_entry_notes] = notes
    }

    get key() { return this[_entry_key] }
    get date() { return this[_entry_date] }
    set date(newDate) { return this[_entry_date] = newDate }

    get title() { return this[_entry_title] }
    set title(newTitle) { return this[_entry_title] = newTitle }

    get notes() { return this[_entry_notes] }
    set notes(newNotes) { this[_entry_notes] = newNotes }
}

exports.AbstarctEntriesStore = class AbstractEntriesStore {
    async close() {}
    async create() {}
    async read() {}
    async update() {}
    async destroy() {}
    async keyList() {}
    async count() {}
}


