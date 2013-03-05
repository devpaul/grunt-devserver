module.exports = corsSupport

function corsSupport(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    next()
}