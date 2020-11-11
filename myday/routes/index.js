const express = require('express')
const router = express.Router()

router.get('/', async function(req, res, next) {

  res.render('index',{
    browserTitle : 'MyDay Home Page',
    pageHeading : 'MyDay',
    styles : ['/stylesheets/style.css', '/stylesheets/style.css']
  })
})

module.exports = router