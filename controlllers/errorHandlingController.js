exports.handle404Statuses = (error, req, res, next) => {
    if(error.status===404){
res.status(404).send({message: "invalid pathway"});
    }else{
        next(error)
    }
};

exports.handle500Statuses = (error, req, res, next) => {
res.status(500).send({message: 'Soz, server error!'})
}