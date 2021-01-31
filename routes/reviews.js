const express = require('express')
const catchAsync = require('../utils/catchAsync')

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')
const reviewsController = require('../controllers/reviews')

const router = express.Router({ mergeParams: true })

router.post('/', isLoggedIn, validateReview, catchAsync(reviewsController.createReviews))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewsController.deleteReviews))

module.exports = router
