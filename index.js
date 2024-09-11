const express = require('express');
const config = require('./utils/config');
const logger = require('./utils/logger');
const app = express();


const port = process.env.PORT;
app.listen(port, () => {
    logger.info(`App listening on port: ${config.PORT}`);
})