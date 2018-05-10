var yargs = require('yargs')

const argvs = {

    getArgvs() {
        
        return yargs
            .usage('Usage: node $0 <cmd> [options]')
            .option('port', {
                alias: 'p',
                describe: 'Choose a Port by Express',
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
                default: 6379
            })
            .option('basePath',{
                alias: 'd',
                describe: 'Introduce a Path Root',
                default: '/Users/jaimerc/WorkSpace/WorkSpace/RedisDB'
            })
            .demandOption(['port', 'host', 'redisPort', 'basePath'], 'Please provide both port, host, redisPort and basePath arguments to work with this tool')
            .help()
            .argv
    }
}

module.exports = argvs




