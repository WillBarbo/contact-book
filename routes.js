const express = require('express')
const route = express.Router()

const homeController = require('./src/controllers/homeController')
const loginController = require('./src/controllers/loginController')

//Routes Home
route.get('/', homeController.index)

//Routes Login
route.get('/connect', loginController.index)


module.exports = route