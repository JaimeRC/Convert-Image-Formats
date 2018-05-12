/**
 * Modulo para procerar una ruta de Express.
 * En este modulo lo que se realizara es recibir una peticion con los parametros de la ruta
 * para devolver una imagen almacenada en nuestro disco para poder devolverla en formato buffer
 * con las opciones que nos pudieran pedir.
 * 
 * @param {Object}      mimeTypes   Objeto con todos los 'Content-Type' para la respuesta.
 * @param {Object}      req         Objeto donde recibiremos los parametros y/o las query.
 * @param {Response}    res         Objeto donde responderemos, enviando la informacion indicada. 
 * @param {Object}      options     Objeto donde almacenaremos todas las variables que necesitaremos.
 * @param {String}      folder      Parametro que indica la carpeta donde estara nuestras imagenes almacenadas.
 * @param {String}      subdolder   Parametro que indica la subcarpeta donde estara nuestras imagenes almacenadas.
 * @param {String}      file        Parametro que indica el nombre del archivo a procesar.
 * @param {String}      force       Query que indica si necesita la imagen forzada al tamaño indicado ignorando el AspectRatio.
 * @param {String}      ext         Query que indica si necesita la imagen en formato WEBP.
 * @param {String}      key         Nombre con que se va a almacenar el buffer de la imagen.
 * @param {String}      path        Ruta donde esta almacenada nuestra imagen.
 * @param {String}      baseBath    Ruta de nuestra aplicacion
 */

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