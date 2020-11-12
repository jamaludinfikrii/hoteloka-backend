const Router = require('express').Router()
const jwtVerify = require('../middleware/jwt')
const {createTransaction, paymentApproved, getTransactionByIdUser} = require('./../controllers/transactionController')

Router.post('/',createTransaction)
Router.post('/payment-approve',jwtVerify,paymentApproved)
Router.get('/transactionusers/:id',getTransactionByIdUser)

module.exports = Router

