if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const session = require('express-session')
const flash = require('connect-flash')
const path = require('path')
const mongoose = require('mongoose')
const mongoSanitize = require('express-mongo-sanitize')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const helmet = require('helmet')
const helmetConfig = require('./setup/helmetConfig')
const { configureSessionStore, sessionConfig } = require('./setup/sessionConfig')
const User = require('./models/user')

// routes
const homeRoute = require('./routes/home')
const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const noMatchRoute = require('./routes/404')

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('Database connected')
})

const app = express()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// sanitize input to avoid mongo query injections
app.use(
  mongoSanitize({
    replaceWith: '_'
  })
)

// add and configure session
configureSessionStore()
app.use(session(sessionConfig))

// add flash
app.use(flash({ contentSecurityPolicy: false }))

// add helmet
app.use(helmet.contentSecurityPolicy(helmetConfig))

// add passport and configure local strategy
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
  res.locals.currentUser = req.user
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next()
})

// serve public directory
app.use(express.static(path.join(__dirname, 'public')))

// add routes
app.use('/', homeRoute)
app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use('/', noMatchRoute)

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err

  if (!err.message) {
    err.message = 'Something went wrong!'
  }

  res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
  console.log('Serving on port 3000')
})
