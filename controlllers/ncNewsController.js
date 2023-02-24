const { fetchTopics, fetchArticles, fetchArticlesById, fetchComments, insertComment} = require("../models/ncNewsModels")

exports.getTopics = (req, res, next) => {
fetchTopics().then((topics) => {
    res.status(200).send({topics})
})
.catch(error => {

    next(error)
})
};


exports.getArticles = (req, res, next) => {
    const {topic, sort_by, order} = req.query
    fetchArticles(topic, sort_by, order).then((articles) => {
 
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
    exports.postComment = (req, res, next) => {
        const {article_id} = req.params;
        const newComment = req.body;
        insertComment(article_id, newComment).then((comment) => {
            res.status(201).send({comment})
        }).catch(error => {
            next(error)
        })
    }