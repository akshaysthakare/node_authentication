const express = require('express')
const router = express.Router()
const createError = require('http-errors')
const User = require('../Models/User.model')
const { authSchema } = require('../helpers/validation_schema')
const { signAccessToken, signRefreshToken, verifyRequestToken } = require('../helpers/jwt_helper')

router.post('/register', async (req, res, next) => {
  // console.log(req.body)
  try {
    //const { email, password } = req.body
    //if (!email || !password) throw createError.BadRequest()

    const result = await authSchema.validateAsync(req.body)

    const doesExist = await User.findOne({ email: result.email })
    if (doesExist) throw createError.Conflict(`${result.email} is already registed`)

    const user = new User(result)
    const saveUser = await user.save()
    const accessToken = await signAccessToken(saveUser.id)
    const refreshToken = await signRefreshToken(saveUser.id)
    res.send({ accessToken, refreshToken })


  } catch (error) {
    if (error.isJoi === true) error.status = 422
    next(error)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const result = await authSchema.validateAsync(req.body)
    const user = await User.findOne({ email: result.email })
    if (!user) throw createError.NotFound('User Not Registered')

    const isMatch = await user.isValidPassword(result.password)
    if (!isMatch) throw createError.Unauthorized('Email/password not valid')

    const accessToken = await signAccessToken(user.id)
    const refreshToken = await signRefreshToken(user.id)

    res.send({ accessToken, refreshToken })
  } catch (error) {
    if (error.isJoi === true) return next(createError.BadRequest('Invalid Email/Password'))
    next(error)
  }
})

router.post('/refresh-token', async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) throw createError.BadRequest()
    const userId = await verifyRequestToken(refreshToken)
    const accessToken = await signAccessToken(userId)
    const refToken = await signRefreshToken(userId)
    res.send({ accessToken: accessToken, refreshToken: refToken })
  } catch (error) {
    next(error)
  }

})

router.delete('/logout', async (req, res, next) => {
  try {
    // const {refreshToken}= req.body
    // if(!refreshToken) throw createError.BadRequest()

  } catch (error) {
    next(err)
  }
})

module.exports = router