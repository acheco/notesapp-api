const config = require('./utils/config');
const logger = require('./utils/logger');
const app = require('./app');


const port = process.env.PORT;
app.listen(port, () => {
    logger.info(`App listening on port: ${config.PORT}`);
})