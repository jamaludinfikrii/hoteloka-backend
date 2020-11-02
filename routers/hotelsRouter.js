const { getAllHotels, getHotelDetailById } = require('../controllers/hotelsController')
const Router = require('express').Router()

Router.get('/',getAllHotels)
Router.get('/:id',getHotelDetailById)

module.exports = Router