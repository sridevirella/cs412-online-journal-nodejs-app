let User = require('../models/user').User
const {body, validationResult} = require('express-validator')
const EncryptorDecrypt = require("encrypt_decrypt")
const passport = require('passport')

let encryptDecryptObj = new EncryptorDecrypt()

exports.userController = {

    register: async (req, res, next) => {

        res.render('users/register', {
            isCreate: true,
            browserTitle: 'Sign Up Page',
            pageHeading: 'Let\'s Create Your account',
            styles: ['/stylesheets/style.css'],
            isRegisterActive: 'active'
        })
    },
    login: async (req, res, next) => {

        res.render('users/login', {
            browserTitle: 'Login Page',
            pageHeading: 'Login',
            styles: ['/stylesheets/style.css'],
            isLoginActive: 'active'
        })
    },
    save: async(req, res, next) => {

        if(req.body.saveMethod === 'create')
            await create(req, res, next)
        else
            await update(req, res, next)
    },
    profile: async(req, res, next) => {

        if(req.isAuthenticated()) {
            try {
                let user = req.user

                res.render('users/edit_profile', {
                    isCreate: false,
                    browserTitle: 'Profile Page',
                    pageHeading: 'Profile Information',
                    styles: ['/stylesheets/style.css'],
                    isProfileActive: 'active',
                    firstName: user.name.first,
                    lastName: user.name.last,
                    email: encryptDecryptObj.decrypt(user.email)
                })
            } catch (err) {
                next(err)
            }
        } else {
            req.flash('error', 'Please log in to access profile')
            res.redirect('/users/login')
        }
    },
    authenticate: async (req, res, next) => {

         req.body.email = encryptDecryptObj.encrypt(req.body.email)

        await passport.authenticate('local', async function (err, user, info){

            if(err)
                return next(err)
            if(!user) {
                req.flash('error', 'Failed to login')
                return res.redirect('back')
            }
            req.login(user, function (err) {
                if(err)
                    return next(err)

                req.flash('success', `${user.fullName} logged in`)
                return res.redirect('/diary_entries/add')
            })
        })(req, res, next)
    },
    changePassword: async (req, res, next) => {

        if(req.isAuthenticated()) {

            let user = await User.findOne({email: req.user.email})
            await user.changePassword (req.body.oldPassword, req.body.newPassword, function(err) {

                if(err) {
                    if(err.name === 'IncorrectPasswordError') {
                        req.flash('error', 'Incorrect old password')
                        res.redirect('/users/profile')
                    }
                } else {
                    req.logout()
                    req.flash('success', 'Password has been updated successfully, Please sign in with new password')
                    res.redirect('/users/login')
                }
            })

        } else {
            req.flash('error', 'Please log in to change password')
            res.redirect('/users/login')
        }
    },
    logout: async (req, res) => {

        if(req.isAuthenticated()) {
            req.logout()
            req.flash('success', `successfully logged out`)
            res.redirect('/')
        } else {
        req.flash('error', 'You have not log in')
        res.redirect('/users/login')
      }
    }
}

const create = async (req, res, next) => {

    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        req.flash('error', errors.array().map(e => e.msg + '</br>').join(''))
        res.redirect('/users/register')

    } else {
        try {
            req.body.email = await encryptDecryptObj.encrypt(req.body.email)

            let userParams = getUserParams(req.body)
            let newUser = new User(userParams)
            let user = await User.register(newUser, req.body.password)

            req.flash('success', `${user.fullName}'s account created successfully`)
            res.redirect('/users/login')

        }catch (err) {

            console.log(`Error saving user ${err.message}`)
            req.flash('error', 'Failed to create user account. Invalid email')
            res.redirect('/users/register')
        }
    }
}


const update = async (req, res, next) => {

   const errors = validationResult(req)

    if(!errors.isEmpty()) {
        req.flash('error', errors.array().map(e => e.msg + '</br>').join(''))
        res.redirect('/users/profile')

    } else {
        try {
            let userParams = getUserParams(req.body)

            let user = await User.findOneAndUpdate({email: encryptDecryptObj.encrypt(userParams.email)}, {
                name: userParams.name
            })

            req.flash('success', 'profile updated successfully')
            res.redirect('/users/profile')

        }catch (err) {

            console.log(`Error editing profile ${err.message}`)
            req.flash('error', 'Failed to edit profile')
            res.redirect('/users/profile')
        }
    }
}

exports.registerValidations = [

    body('first')
        .notEmpty().withMessage('First name is required')
        .isLength({min:2}).withMessage('First name must be at least 2 characters'),

    body('last')
        .notEmpty().withMessage('Last name is required')
        .isLength({min:2}).withMessage('Last name must be at least 2 characters'),

    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().normalizeEmail().withMessage('Email is invalid'),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({min: 5}).withMessage('Password must be at least 5 characters')
]

exports.profileValidations = [

    body('first')
        .notEmpty().withMessage('First name is required')
        .isLength({min:2}).withMessage('First name must be at least 2 characters'),

    body('last')
        .notEmpty().withMessage('Last name is required')
        .isLength({min:2}).withMessage('Last name must be at least 2 characters'),

    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().normalizeEmail().withMessage('Email is invalid'),
]

exports.loginValidations = [

    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().normalizeEmail().withMessage('Email is invalid'),

    body('password')
        .notEmpty().withMessage('Password is required')
]

const getUserParams = body => {

    return {
        name: {
            first: body.first,
            last: body.last
        },
        email: body.email,
        password: body.password
    }
}