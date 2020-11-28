const mongoose = require('mongoose')

const DiaryEntrySchema = new mongoose.Schema({

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
DiaryEntrySchema.index({ title: 'text'})
exports.DiaryEntry = mongoose.model('diaryentries', DiaryEntrySchema)