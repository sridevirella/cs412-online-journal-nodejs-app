const bcrypt = require("bcrypt");
let User = require('../models/user').User
const {body, validationResult} = require('express-validator')

exports.userController = {

    register: async (req, res, next) => {

        res.render('users/register', {
            browserTitle: 'Sign Up Page',
            pageHeading: 'Sign Up',
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
    create: async (req, res, next) => {

        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            req.flash('error', errors.array().map(e => e.msg + '</br>').join(''))
            res.redirect('/users/register')

        } else {
            try {
                let userParams = getUserParams(req.body)
                let user = await User.create(userParams)

                req.flash('success', `${user.fullName}'s account created successfully`)
                res.redirect('/users/login')

            }catch (err) {

                console.log(`Error saving user ${err.message}`)
                req.flash('error', `Failed to create user account because ${err.message}`)
                res.redirect('/users/register')
            }
        }
    },
    authenticate: async (req, res, next) => {
        try {

            let users = await User.find({})
             let user
            for(let i=0 ;i < users.length; i++) {
                user = await users[i].emailComparison(req.body.email)
                if (user) {
                     user = users[i]
                     break;
                }
            }

            if(user && await user.passwordComparison(req.body.password)) {

                req.flash('success', `${user.fullName} logged in successfully`)
                res.redirect('/')

            } else {
                req.flash('error', 'Your email or password is incorrect. Please try again')
                res.redirect('/users/login')
            }
        } catch (err) {

            req.flash('error', `Failed to login because of  ${err.message}`)
            res.redirect('/users/login')
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