const db = require("../db/connection")

exports.fetchTopics = () => {
return db.query("SELECT * FROM topics;")
.then((result) => result.rows)
}

exports.fetchArticles = () => {
    return db.query(`SELECT articles.*, 
    COUNT(comments.article_id) :: INT AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`)
    .then((result) => result.rows)
    }

    exports.fetchArticlesById = (article_id) => {
        return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
        .then((result) =>  {
            if(result.rows.length===0){
                return Promise.reject({
                    status: 404,
                    message: "article id not found"
                }) 
            }else{
                return result.rows[0]
            }
        })
    }
    exports.fetchComments = (article_id) => {
        return db.query(`SELECT * FROM comments 
        WHERE article_id = $1 
        ORDER BY comments.created_at DESC`, [article_id])
        .then((result) => {
            if(result.rows.length===0){
                return Promise.reject({
                    status: 404,
                    message: "article id not found"
                }) 
            }else{
                return result.rows
            }
        })
    }
    exports.insertComment = (article_id, newComment) => {
       
        return db.query(`INSERT INTO comments 
        (author, body, article_id) 
        VALUES ($1, $2, $3) 
        RETURNING *`, 
        [newComment.username, newComment.body, article_id])
        .then((result) => {
            if(newComment.body===undefined || newComment.username===undefined) {
                return Promise.reject({
                    status: 400,
                    message: "username or comment missing"
                })
            }
            return result.rows[0]
          
        })
    }

    exports.fetchUsers = () => {
        return db.query("SELECT * FROM users;")
        .then((result) => result.rows)
        }
    exports.addVotes = (article_id, newVotes ) => {
         if(typeof newVotes !== "number" || newVotes ===undefined ) {
            return Promise.reject({
                status: 400,
                message: "invalid voting"
            })
        }
        return db.query(`UPDATE articles 
        SET votes=votes + $1 
        WHERE article_id = $2 
        RETURNING *;`, [newVotes, article_id])
        .then((result) => {
            if(result.rows.length===0){
                return Promise.reject({
                    status: 404,
                    message: "article id not found"
                }) 
            }
            return result.rows[0]
        })
    }
