const logic = require('../../logic/logic')

const argv = require('../../initServer').getArgvs()
const basePath = argv.basePath

const mimeTypes = {
    'png': 'image/png',
    'jpg': 'image/jpg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'application/image/svg+xml',
    'webp': 'image/webp'
}

module.exports = (req, res) => {
    const { params: { folder, subfolder, file } } = req
    let { query: { fit, force, ext } } = req

    if (ext === "" || ext === undefined) ext = "jpg"

    let nameFile = file.split('.')
    if (fit === 'true') `${nameFile[0]}_fit`
    if (force === 'force') `${nameFile[0]}_force`
    if (ext === 'webp') `${nameFile[0]}_webp`

    let path = `${basePath}/${folder}/${subfolder}/${file}`
    let key = `${basePath}/${folder}/${subfolder}/${nameFile.join('.')}`

    const options = {
        fit: fit,
        force: force,
        ext: ext,
        key: key,
        path: path
    }


    logic.getExistImage(options)
        .then(result => {
            if (result === "OK") {
                return logic.getImage(options)
            } else {
                return logic.setImage(options)
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