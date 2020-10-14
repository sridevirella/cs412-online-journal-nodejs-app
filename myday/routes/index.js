const express = require('express');
const router = express.Router();

router.get('/', async function(req, res, next) {
  let options = {
    title : 'Online Journal App',
    appName : 'MyDay',
    styles : ['/stylesheets/style.css','/stylesheets/index.css']
  }
  res.render('index', { title: options.title, appName: options.appName, styles: options.styles, layout: 'layout' })
})

module.exports = router