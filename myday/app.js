const express = require('express')
const path = require('path')
const logger = require('morgan')
const http = require('http')
const hbs = require('express-handlebars')
const session = require('express-session')
const MemoryStore = require('memorystore')(session)
const connectFlash = require('connect-flash')
const mongoose = require('mongoose');

(async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
    }catch (err) {
        console.log(err)
    }
})()

const appSupport = require('./appsupport')
const indexRouter = require('./routes/index')
const entriesRouter = require('./routes/diary_entries')
const usersRouter = require('./routes/users')

const app = express()
exports.app = app

// View engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
app.engine('hbs', hbs({
    extname : 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials'
}))

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(session({
    secret: process.env.SECRET_KEY,
    cookie: { maxAge: 86400000},
    store: new MemoryStore({
        checkPeriod: 86400000
    }),
    resave: false,
    saveUninitialized: false
}))
app.use(connectFlash())

app.use(express.static(path.join(__dirname, 'public')))
app.use('/assets/vendor/bootstrap', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist')))
app.use('/assets/vendor/jquery', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')))
app.use('/assets/vendor/popper.js', express.static(path.join(__dirname, 'node_modules', 'popper.js', 'dist', 'umd')))
app.use('/assets/vendor/feather-icons', express.static(path.join(__dirname, 'node_modules', 'feather-icons', 'dist')))

app.use((req, res, next) => {
    res.locals.flashMessages = req.flash()
    next()
})

//Router function lists
app.use('/', indexRouter)
app.use('/diary_entries', entriesRouter)
app.use('/users', usersRouter)

//Error handlers
app.use(appSupport.basicErrorHandler)
app.use(appSupport.handlePageNotFound)

const port = appSupport.normalizePort(process.env.PORT || '3000')
exports.port = port
app.set('port', port)

//Server setup
const server = http.createServer(app)
exports.server = server
server.listen(port)
server.on('error', appSupport.onError)
server.on('listening', appSupport.onListening)
