const Router = require('express').Router()
const jwtVerify = require('../middleware/jwt')
const {createTransaction, paymentApproved, getAllTransactions} = require('./../controllers/transactionController')

Router.post('/',createTransaction)
Router.post('/payment-approve',jwtVerify,paymentApproved)
Router.get('/all',getAllTransactions)

module.exports = Router

