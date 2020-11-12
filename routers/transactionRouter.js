const Router = require('express').Router()
const jwtVerify = require('../middleware/jwt')
const {createTransaction, paymentApproved, getAllTransactions, getTransactionsByIdUser} = require('./../controllers/transactionController')

Router.post('/',createTransaction)
Router.post('/payment-approve',jwtVerify,paymentApproved)
Router.get('/all',getAllTransactions)
Router.get('/users_id/:idUser',getTransactionsByIdUser)

module.exports = Router

