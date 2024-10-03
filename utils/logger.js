
// Logger que imprime información y errores a la consola:

const info = (...params) => console.log(...params);
const error = (...params) => console.log(...params);

module.exports = {
    info,
    error,
}