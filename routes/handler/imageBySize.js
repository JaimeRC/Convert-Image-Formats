const logic = require('../../logic/logic')

const argv = require('../../initServer').getArgvs()
const basePath = argv.basePath

const mimeTypes = {
    'png': 'image/png',
    'jpg': 'image/jpg',
    'gif': 'image/gif',
    'svg': 'application/image/svg+xml',
    'webp': 'image/webp'
};

module.exports = (req, res) => {
    const { params: { folder, subfolder, file, size } } = req
    let { query: { fit, force, ext } } = req

    if (ext === "" || ext === undefined) ext = "jpg"

    let nameFile = file.split('.')
    if (fit === 'true') nameFile[0] += "_fit"
    if (force === 'true') nameFile[0] += "_force"
    if (ext !== 'jpg') nameFile[0] += ext

    let path = `${basePath}/${folder}/${subfolder}/${file}`
    let key = `${basePath}/${folder}/${subfolder}/${size}/${nameFile.join('.')}`
    console.log(path)

    let arraySize = size.split('x')
    let width = parseInt(arraySize[0])
    let height = parseInt(arraySize[1])

    const options = {
        fit: fit,
        force: force,
        ext: ext,
        width: width,
        height, height,
        key: key,
        path: path
    }

    logic.getExistImage(options)
        .then(result => {
            if (result === "OK") {
                return logic.getImage(options)
            } else {
                return logic.setImageBySize(options)
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
}