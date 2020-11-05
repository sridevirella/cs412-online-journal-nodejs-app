exports.AbstarctEntriesStore = class AbstractEntriesStore {
    async close() {}
    async create() {}
    async read() {}
    async update() {}
    async destroy() {}
    async keyList() {}
    async count() {}
}

const mongoose = require('mongoose')
const DiaryEntrySchema = new mongoose.Schema({
    key: {
        type: Number,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        required: [true, 'Date is required']
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        minlength: [3, 'Minimum title length is 3 characters']
    },
    notes: {
        type: String,
        required: [true, 'Note body is required']
    }
})

exports.DiaryEntry = mongoose.model('diaryentries', DiaryEntrySchema)