const Router = require('express').Router()
const jwtVerify = require('../middleware/jwt')
const {createTransaction} = require('./../controllers/transactionController')

Router.post('/',createTransaction)

module.exports = Router