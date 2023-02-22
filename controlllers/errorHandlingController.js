
exports.handlePSQLErrors = (error, req, res, next) => {
    if(error.code === '22P02'){
        res.status(400).send({message: "invalid article_id"})
    }else{
        next(error)
    }
}

exports.handleCustomErrors = (error, req, res, next) => {
    if(error.status && error.message){
        res.status(404).send({message: 'article id not found'})
    }
}


exports.handle500Statuses = (error, req, res, next) => {
res.status(500).send({message: 'Soz, server error!'})
}