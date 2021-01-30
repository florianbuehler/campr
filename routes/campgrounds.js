﻿const express = require('express')
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground')
const { campgroundSchema } = require('../schemas')
const { isLoggedIn } = require('../middleware')

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body)
  if (error) {
    const msg = error.details.map((el) => el.message).join(',')
    throw new ExpressError(msg, 400)
  }

  next()
}

const router = express.Router()

router.get(
  '/',
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
  })
)

router.post(
  '/',
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground)
    await campground.save()

    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
  })
)

router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new')
})

router.get(
  '/:id',
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews')

    if (!campground) {
      req.flash('error', 'Cannot find that campground!')
      return res.redirect('/campgrounds')
    }

    res.render('campgrounds/show', { campground })
  })
)

router.put(
  '/:id',
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })

    if (!campground) {
      req.flash('error', 'Cannot find that campground!')
      return res.redirect('/campgrounds')
    }

    req.flash('success', 'Successfully updated the campground!')
    res.redirect(`/campgrounds/${campground._id}`)
  })
)

router.delete(
  '/:id',
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)

    req.flash('success', 'Successfully deleted the campground!')
    res.redirect('/campgrounds')
  })
)

router.get(
  '/:id/edit',
  isLoggedIn,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground })
  })
)

module.exports = router