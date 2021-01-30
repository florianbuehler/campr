const express = require('express')
const multer = require('multer')
const catchAsync = require('../utils/catchAsync')
const campgroundsController = require('../controllers/campgrounds')
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware')
const { storage } = require('../cloudinary')

const router = express.Router()
const upload = multer({ storage })

router
  .route('/')
  .get(catchAsync(campgroundsController.index))
  // .post(isLoggedIn, validateCampground, catchAsync(campgroundsController.createCampground))
  .post(upload.array('image'), (req, res) => {
    res.send('It worked?!')
  })

router.get('/new', isLoggedIn, campgroundsController.renderNewForm)

router
  .route('/:id')
  .get(catchAsync(campgroundsController.showCampground))
  .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgroundsController.updateCampground))
  .delete(isLoggedIn, isAuthor, catchAsync(campgroundsController.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundsController.renderEditForm))

module.exports = router
