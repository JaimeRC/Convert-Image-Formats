/**
 * Modulo que procesa y distribuye las peticiones recibidas.
 */

const express = require('express')
const routes = express.Router()

const { image, imageBySize } = require('./handler/index')

routes.get('/:folder/:file', image)

routes.get('/:folder/:size/:file', imageBySize)

module.exports = routes