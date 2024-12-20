const JWT = require('jsonwebtoken')
const createError = require('http-errors')

module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {
      }
      const secret = process.env.ACCESS_TOKEN_SECRET;
      const options = {
        expiresIn: '1y',
        issuer: 'pickup.com',
        audience: userId,
      }
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message)
          reject(createError.InternalServerError())
        }
        resolve(token)
      })
    })
  },

  verifyAccessToken: (req, res, next) => {
    if (!req.headers['authorization']) return next(createError.Unauthorized())
    const authHeader = req.headers['authorization']
    const bearerToken = authHeader.split(' ')
    const token = bearerToken[1]
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        // if (err.name === 'JsonWebTokenError') {
        //   return next(createError.Unauthorized())
        // } else {
        //   return next(createError.Unauthorized(err.message)) //jwt token expire
        // }
        //alternative mode for error handling
        const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
        return next(createError.Unauthorized(message))
      }
      req.payload = payload
      next()
    })
  },

  signRefreshToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {
      }
      const secret = process.env.REFERESH_TOKEN_SECRET;
      const options = {
        expiresIn: '1y',
        issuer: 'pickup.com',
        audience: userId,
      }
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message)
          reject(createError.InternalServerError())
        }
        resolve(token)
      })
    })
  },

  verifyRequestToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      JWT.verify(refreshToken, process.env.REFERESH_TOKEN_SECRET, (err, payload) => {
        if (err) return reject(createError.Unauthorized())
        const userId = payload.aud

        resolve(userId)
      })
    })
  }
}