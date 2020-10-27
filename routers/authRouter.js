const express = require('express')
const Router = express.Router()
const Contr = require('./../controllers/authController')
const jwtVerify = require('./../middleware/jwt')

Router.post('/register' , Contr.register)
Router.post('/login' ,Contr.login)
Router.patch('/user-email-verification' ,Contr.verification)
Router.post('/is-user-verified',jwtVerify, Contr.isUserVerify)


module.exports = Router