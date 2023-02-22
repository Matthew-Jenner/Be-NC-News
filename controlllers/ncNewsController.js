const { fetchTopics, fetchArticles, fetchArticlesById, fetchComments} = require("../models/ncNewsModels")

exports.getTopics = (req, res, next) => {
fetchTopics().then((topics) => {
    res.status(200).send({topics})
})
.catch(error => {

    next(error)
})
};

exports.getArticles = (req, res, next) => {
    fetchArticles().then((articles) => {
        res.status(200).send({articles})
    })
    .catch(error => {
        next(error)
    })
    };

    exports.getArticlesById = (req, res, next) => {
        const {article_id} = req.params;
        fetchArticlesById(article_id).then((article) => {
            res.status(200).send({article})
        }).catch(error => {
            next(error)
        })
    }

    exports.getComments = (req, res, next) => {
        const {article_id} = req.params;
        fetchComments(article_id).then((comments) => {
            res.status(200).send({comments})
        }).catch(error => {
            next(error)
        })
    }