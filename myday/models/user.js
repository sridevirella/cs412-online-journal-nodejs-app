const mongoose = require('mongoose')
const Schema = mongoose.Schema
const SchemaTypes = mongoose.SchemaTypes
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema({
    name: {
        first: {
            type: String,
            trim: true
        },
        last: {
            type: String,
            trim: true
        }
    },
    entries: [
        {
            type: SchemaTypes.ObjectID,
            ref: 'DiaryEntry'
        }
    ]
})

UserSchema.set('toJSON', {getters: true, virtuals: true})
UserSchema.set('toObject', {getters: true, virtuals: true})

UserSchema.plugin(passportLocalMongoose, {
    usernameField: 'email'
})

UserSchema.virtual('fullName').get(function () {

    return `${this.name.first} ${this.name.last}`
})


exports.User = mongoose.model('users', UserSchema)