const Router = require('express').Router()
const jwtVerify = require('../middleware/jwt')
const {createTransaction, paymentApproved} = require('./../controllers/transactionController')

Router.post('/',createTransaction)
Router.post('/payment-approve',jwtVerify,paymentApproved)

module.exports = Router

