exports.handleCustomErrors = (error, req, res, next) => {
    if(error.status && error.message ){
        res.status(error.status).send({message: error.message})
    } next(error)
}

exports.handlePSQLErrors = (error, req, res, next) => {
    if(error.code === '22P02'){
        res.status(400).send({message: "invalid article_id"})
    }else if(error.code === '23503'){
        if(error.constraint==='comments_article_id_fkey'){
            res.status(404).send({message: "article id not found"})
        }
        res.status(404).send({message: "This is not a user"})
    }else if(error.code === '23502'){
        res.status(400).send({message: "username or comment missing"})
    }
        {
        next(error)
    }
}



exports.handle500Statuses = (error, req, res, next) => {
res.status(500).send({message: 'Soz, server error!'})
}