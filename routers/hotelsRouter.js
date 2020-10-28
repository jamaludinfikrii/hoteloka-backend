const { getAllHotels } = require('../controllers/hotelsController')
const Router = require('express').Router()

Router.get('/',getAllHotels)

module.exports = Router