import HttpError from "../errors/http-error.js"

const handleUnknownRoute = (req, res, next) => {
    return next(new HttpError(404, 'Ruta no encontrada'));
}

export default handleUnknownRoute