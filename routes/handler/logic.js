const { host, redisPort } = require('../../initServer').getArgvs()

const redis = require('redis')
const client = redis.createClient(redisPort, host, { return_buffers: true })

const sharp = require('sharp')
const webp = require('webp-converter')

const logic = {

    getExistImage(path) {
        return new Promise((resolve, reject) => {

            const result = {};

            client.exists(path, (err, reply) => {
                if (err) reject(err)

                if (reply === 1) {
                    result.status = "OK"
                } else {
                    result.status = "KO"
                }
                console.log(result)
                resolve(result)
            })
        })
    },

    getImage(path, options) {
        return new Promise((resolve, reject) => {

            //path = this.extensionFileWebq(path, option.ext)

            client.get(path, (err, data) => {
                if (err) reject(err)

                resolve(data)
            })
        })
    },

    setImage(path, options) {
        return new Promise((resolve, reject) => {

            //path = this.extensionFileWebq(path, option.ext)

            sharp(path)
                .toBuffer({ resolveWithObject: true })
                .then(({ data, info }) => {
                    client.set(path, data, redis.print)
                    console.log(info)
                    return path
                })
                .then(key => {
                    client.get(key, (err, data) => {
                        if (err) throw Error("Error: " + err.message)
                        resolve(data)
                    })
                })
                .catch(err => reject(err));
        })
    },

    setImageBySize(path, options) {
        return new Promise((resolve, reject) => {
            console.log(path)

            let imagePath = path.split('/')
            console.log(imagePath)
            imagePath.splice(imagePath.length - 2, 1)
            imagePath = imagePath.join('/')
            console.log(imagePath)

            //path = this.extensionFileWebq(path, option.ext)

            sharp(imagePath)
                .resize(options.width, options.heigth)
                .toBuffer({ resolveWithObject: true })
                .then(({ data, info }) => {
                    client.set(path, data, redis.print)
                    console.log(info)
                    return path
                })
                .then(key => {
                    client.get(key, (err, data) => {
                        if (err) throw Error("Error: " + err.message)
                        resolve(data)
                    })
                })
                .catch(err => reject(err));
        })
    },

    setExtFileWebq(path, ext) {
        if (ext === "webp") {
            let file = path.split("/").pop().split(".").shift()

            webp.cwebp(path, `${file}.webp`, "-q 90", (status) => console.log(status))

            path = `${file}.webp`
        }

        return path
    }

}

module.exports = logic