const db = require("../db/connection")

exports.fetchTopics = () => {
return db.query("SELECT * FROM topics;")
.then((result) => result.rows)
}

// exports.fetchArticles = () => {
//     return db.query(`SELECT articles.*, 
//     COUNT(comments.article_id) :: INT AS comment_count
//     FROM articles
//     LEFT JOIN comments
//     ON articles.article_id = comments.article_id
//     GROUP BY articles.article_id
//     ORDER BY articles.created_at DESC;`)
//     .then((result) => result.rows)
//     }

exports.fetchArticles =  (topic, sort_by = "created_at", order="DESC") => {
    const queryValue = [];

    if(!["article_id", "title", "author", "topic", "created_at", "votes", "article_img_url", "comment_count" ].includes(sort_by)){
        return Promise.reject({
            status: 400,
            message: "Invalid sort query"
        })
    }
    if(!["DESC", "ASC"].includes(order)){
        return Promise.reject({
            status: 400,
            message: "Invalid order query"
        })
    }

       let baseQuery = `SELECT articles.*, 
        COUNT(comments.article_id) :: INT AS comment_count
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id`
    
        if(topic){
            queryValue.push(topic)
            baseQuery += `
            WHERE topic = $1 
            GROUP BY articles.article_id
            ORDER BY ${sort_by} ${order}
            ` 
        }else{
            baseQuery += `
            GROUP BY articles.article_id
            ORDER BY ${sort_by} ${order}
            `
        }
   
        console.log(baseQuery, queryValue)
        return db.query(baseQuery, queryValue)
        .then((result) =>  {
        if(result.rows.length===0){
                return Promise.reject({
                    status: 404,
                    message: "Invalid topic"
                }) 
            }else{
                return result.rows
        }})
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