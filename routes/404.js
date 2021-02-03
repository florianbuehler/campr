const express = require('express')
const ExpressError = require('../utils/ExpressError')

const router = express.Router()

router.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

module.exports = router
