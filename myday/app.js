const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const http = require('http')
const hbs = require('express-handlebars')

const appSupport = require('./appsupport')
const indexRouter = require('./routes/index')

const app = express()
exports.app = app

// View engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
app.engine('hbs', hbs({
    extname : 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/layouts'
}))

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

//Router function lists
app.use('/', indexRouter)

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
