const pino = require('pino')

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      translateTime: 'SYS:standard yyyy-mm-dd HH:MM:ss'
    }
  }
});

module.exports = logger;
