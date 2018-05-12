/**
 * Modulo para inicializar el servidor Express y la conexion con la base de datos Redis.
 * 
 * @param {Number}      port        Numero del puerto para el servidor Express.
 * @param {Number}      redisPort   Numero del puerto para la conexion de la base de datos.
 * @param {String}      host        Nombre del dominio que utilizaremos.
 */

const { port, host, redisPort} = require('./initServer').getArgvs()

const redis = require('redis')
const client = redis.createClient(redisPort, host)

const express = require('express')
const app = express()

const imageRoute = require('./routes/images')

app.use('/', imageRoute)

app.listen(port, () => console.log(`Express runnig in port ${port}`))
client.on('connect', () => { console.log(`Redis running in port ${redisPort}`) })
client.on('error', (error) => { console.log(`Error in Redis: ${error}`) })