const logger = require("./logger");

const requestLogger = (req, res, next) => {
    logger.info('Method:', req.method.toUpperCase());
    logger.info('Path:', req.path)
    logger.info('Body:', req.body);
    logger.info('---')
    next();
}

// middleware para manejo de solicitudes con endpoint desconocidos
const unknownEndpoint = (req, res, next) => {
    res.status(404).send({error: 'unknown endpoint '});
    next();
}

// El middleware de manejo de errores debe ser el último en cargarse, de lo contrario,
// tendremos problemas al momento de utilizarlo
const errorHandler = (err, req, res, next) => {
    console.error(err.message);

    if (err.name === 'CastError') {
        return res.status(400).send({error: 'Invalid ID format'});
    }

    if (err.name === 'ValidationError') {
        return res.status(400).send({error: err.message});
    }

    next(err);
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
}
