const session = require('express-session')
const MongoDBStore = require('connect-mongo')(session)

const store = new MongoDBStore({
  url: process.env.DB_URL,
  secret: process.env.SESSION_SECRET,
  touchAfter: 24 * 60 * 60
})

module.exports.configureSessionStore = () => {
  store.on('success', function (e) {
    console.log('Session store error', e)
  })
}

module.exports.sessionConfig = {
  store: store,
  name: 'session',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
