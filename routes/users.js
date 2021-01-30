const express = require('express')
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')
const usersController = require('../controllers/users')

const router = express.Router()

router.route('/register').get(usersController.renderRegister).post(catchAsync(usersController.register))

router
  .route('/login')
  .get(usersController.renderLogin)
  .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), usersController.login)

router.get('/logout', usersController.logout)

module.exports = router
