

exports.handle500Statuses = (error, req, res, next) => {
res.status(500).send({message: 'Soz, server error!'})
}