const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const User = require('../models/user')
const Campground = require('../models/campground')
const Review = require('../models/review')

mongoose.connect('mongodb://localhost:27017/camprDb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('Database connected')
})

const sample = (array) => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
  await User.deleteMany({})
  await Review.deleteMany({})
  await Campground.deleteMany({})

  const user = new User({ username: 'testuser', email: 'testuser@test.invalid' })
  const registeredUser = await User.register(user, 'password')

  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000)
    const price = Math.floor(Math.random() * 20) + 10

    const camp = new Campground({
      author: registeredUser._id,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ab ad adipisci deleniti dicta eos est facilis ipsam iure laborum magni minima modi, neque obcaecati odio odit possimus, provident quas qui quia quos repellendus reprehenderit sunt totam velit veniam vitae voluptas? Consectetur dolorem eveniet id illo, minima placeat sint voluptatum!',
      price: price,
      geometry: {
        type: 'Point',
        coordinates: [-113.1331, 47.0202]
      },
      images: [
        {
          url: 'https://res.cloudinary.com/do2d93jxt/image/upload/v1612082057/campr/qmpdbzxy9fehgk6a03bf.jpg',
          filename: 'campr/qmpdbzxy9fehgk6a03bf'
        },
        {
          url: 'https://res.cloudinary.com/do2d93jxt/image/upload/v1612082057/campr/qgotpsqjcpcus42xgzba.jpg',
          filename: 'campr/qgotpsqjcpcus42xgzba'
        }
      ]
    })
    await camp.save()
  }
}

seedDB().then(() => {
  mongoose.connection.close()
})
