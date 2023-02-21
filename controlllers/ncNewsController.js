const { fetchTopics } = require("../models/ncNewsModels")

exports.getTopics = (req, res, next) => {
fetchTopics().then((topics) => {
    res.status(200).send({topics})
})
.catch(error => {
    console.log(error)
    next(error)
})
};