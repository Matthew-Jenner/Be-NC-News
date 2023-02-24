const { fetchTopics, fetchArticles, fetchArticlesById, fetchComments, insertComment, addVotes, fetchUsers} = require("../models/ncNewsModels")

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
            console.log({article})
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
    exports.getUsers = (req, res, next) => {
        fetchUsers().then((users) => {
            res.status(200).send({users})
        })
        .catch(error => {
        
            next(error)
        })
    }
    exports.patchVotes = (req, res, next) => {
        const {article_id} = req.params;
        const {inc_votes} = req.body;
        addVotes(article_id, inc_votes).then((updatedVotes) => {
            res.status(200).send(updatedVotes)
        }).catch(error => {
    
            next(error);
        })
    }