const argv = require('../initServer').getArgvs()
const basePath = argv.basePath

const express = require('express')
const routes = express.Router()
const logic = require('./handler/logic')

const mimeTypes = {
    'png': 'image/png',
    'jpg': 'image/jpg',
    'gif': 'image/gif',
    'svg': 'application/image/svg+xml',
};

routes.route('/:folder/:subfolder/:file')
    .get((req, res) => {
        const { params: { folder, subfolder, file } } = req
        let { query: { fit, force, ext } } = req

        if (ext === "" || ext === undefined) ext = "jpg"

        const options = {
            fit: fit,
            force: force,
            ext: ext
        }

        let path = `${basePath}/${folder}/${subfolder}/${file}`

        logic.getExistImage(path, options)
            .then(result => {
                if (result.status === "OK") {
                    return logic.getImage(path, options)
                } else {
                    return logic.setImage(path, options)
                }
            })
            .then(img => {
                res.header({ 'Content-Type': mimeTypes[options.ext] })
                res.statusCode = 200
                res.send(img)
            })
            .catch(err => {
                res.statusCode = 500
                res.send(err)
            })
    })


routes.route('/:folder/:subfolder/:size/:file')
    .get((req, res) => {
        const { params: { folder, subfolder, file, size } } = req
        let { query: { fit, force, ext } } = req

        let arraySize = size.split('x')
        let width = parseInt(arraySize[0])
        let heigth = parseInt(arraySize[1])

        if (ext === "" || ext === undefined) ext = "jpg"

        const options = {
            fit: fit,
            force: force,
            ext: ext,
            width: width,
            heigth, heigth
        }

        let path = `${basePath}/${folder}/${subfolder}/${size}/${file}`

        logic.getExistImage(path, options)
            .then(result => {
                if (result.status === "OK") {
                    return logic.getImage(path, options)
                } else {
                    return logic.setImageBySize(path, options)
                }
            })
            .then(img => {
                res.header({ 'Content-Type': mimeTypes[options.ext] })
                res.statusCode = 200
                res.send(img)
            })
            .catch(err => {
                res.statusCode = 500
                res.send(err)
            })
    })

module.exports = routes