/**
 * Modulo para asignar diferentes variables, pueden ser cuando inicializamos el servido por terminal
 * o por defecto.
 * 
 * @name {alias}        Alias que tendriamos que indicar la variable que quedemos asignar valor.
 * @name {describe}     Breve descripcion a la variable que se refiere.
 * @name {type}         Tipo primitivo que tratara la variable que introduzcas.
 * @name {default}      Valor por defecto si no se introduce nada.
 * 
 * @example             node index.js --p 1234 --h 198.168.0.99 --r 4321 -d /user/redisDB
 */

var yargs = require('yargs')

const argvs = {

    getArgvs() {

        return yargs
            .usage('Usage: $0 <cmd> [options]')
            .option('port', {
                alias: 'p',
                describe: 'Choose a Port by Express',
                type: Number,
                default: 8080
            })
            .option('host', {
                alias: 'h',
                describe: 'Choose a Host by Redis',
                default: 'localhost'
            })
            .option('redisPort', {
                alias: 'r',
                describe: 'Choose a Port by Redis',
                type: Number,
                default: 6379
            })
            .option('basePath', {
                alias: 'd',
                describe: 'Introduce a Path Root',
                type: String,
                default: '/Users/jaimerc/WorkSpace/WorkSpace/RedisDB'
            })
            .demandOption(['port', 'host', 'redisPort', 'basePath'],
                'Please provide both port, host, redisPort and basePath arguments to work with this tool')
            .help()
            .argv
    }
}

module.exports = argvs