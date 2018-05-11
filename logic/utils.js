const webp = require('webp-converter')

const utils = {

    async setExtFileWebq(options) {
        if (options.ext === "webp") {
            let file = options.path.split('.')

            await webp.cwebp(options.path, `${file.shift()}.webp`, "-q 90", (status) => console.log(status))
        }
        return options
    }
}


module.exports = utils