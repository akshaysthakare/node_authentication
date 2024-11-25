const express = require('express')
const morgan = require('morgan')
const createError = require('http-errors')
require('dotenv').config()
require('./helpers/init_mogodb')
const AuthRoute = require('./Routes/Auth.route')
///require('./helpers/init_mogodb')

const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', async (req, res, next) => {
  res.send("Hello from live server")
})

app.use('/auth', AuthRoute)

//this help in handling error and next help to pass the error to next app.use
app.use(async (req, res, next) => {
  next(createError.NotFound('this route does not exist'))
})

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    error: {
      status: err.status || 500,
      message: err.message
    }
  })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is live on PORT ${PORT}`)
})