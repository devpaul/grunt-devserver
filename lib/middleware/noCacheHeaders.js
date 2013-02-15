module.exports = noCacheHeaders

function noCacheHeaders(req, res, next) {
    res.setHeader('Cache-Control', 'no-cache')
    next()
}