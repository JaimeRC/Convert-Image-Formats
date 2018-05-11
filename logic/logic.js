const { host, redisPort } = require('../initServer').getArgvs()
const utils = require('./utils')

const redis = require('redis')
const client = redis.createClient(redisPort, host, { return_buffers: true })

const sharp = require('sharp')

const logic = {

    getExistImage(options) {
        return new Promise((resolve, reject) => {
            let result;

            client.exists(options.key, (err, reply) => {
                if (err) reject(err)

                if (reply === 1) {
                    result = "OK"
                } else {
                    result = "KO"
                }
                resolve(result)
            })
        })
    },

    getImage(options) {
        return new Promise((resolve, reject) => {

            client.get(options.key, (err, data) => {
                if (err) reject(err)

                resolve(data)
            })
        })
    },

    setImage(options) {
        return new Promise((resolve, reject) => {

            options = utils.setExtFileWebq(options)

            sharp(options.path)
                .toBuffer({ resolveWithObject: true })
                .then(({ data, info }) => {
                    client.set(options.key, data, redis.print)

                    console.log(info)

                    return data
                })
                .then(resolve)
                .catch(reject);
        })
    },

    setImageBySize(options) {
        return new Promise((resolve, reject) => {

            // options = utils.setExtFileWebq(option)
            const image = sharp(options.path)
console.log(options)
            if (options.force === 'true') {
                image.ignoreAspectRatio()
            } else {
                image.max()
            }
            image
                .resize(options.width, options.height)
                .toBuffer({ resolveWithObject: true })
                .then(({ data, info }) => {
                    client.set(options.key, data, redis.print)

                    console.log(info)

                    return data
                })
                .then(resolve)
                .catch(reject)
        })
    }
}

module.exports = logic