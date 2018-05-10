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