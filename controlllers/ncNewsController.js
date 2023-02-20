const { fetchTopics } = require("../models/ncNewsModels")

exports.getTopics = (req, res) => {
fetchTopics().then((topics) => {
    res.status(200).send({topics})
})
};