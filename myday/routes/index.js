const express = require('express')
const router = express.Router()

router.get('/', async function(req, res, next) {
  let options = {
    browserTitle : 'MyDay Home Page',
    pageHeading : 'MyDay',
    styles : ['/stylesheets/style.css','/stylesheets/index.css']
  }
  res.render('index',options)
})

module.exports = router