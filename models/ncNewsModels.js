const db = require("../db/connection")
const fs = require("fs/promises")

exports.fetchEndpoints = () => {
    return fs.readFile(`${__dirname}/../endpoints.json`, "utf-8")
    .then((data) => JSON.parse(data))
}

exports.fetchTopics = () => {
return db.query("SELECT * FROM topics;")
.then((result) => result.rows)
}


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
   
      
        return db.query(baseQuery, queryValue)
        .then((result) =>  {
       
                return result.rows
        })
    }
    

    exports.fetchArticlesById = (article_id) => {
        return db.query(`
        SELECT articles.*, COUNT(comments.article_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON comments.article_id = articles.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id
    `, [article_id])
        .then((result) =>  {
            if(result.rows.length){
                result.rows[0].comment_count = Number(result.rows[0].comment_count)
                return result.rows[0]
            }
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

    exports.removeComment = (comment_id) => {
        if( isNaN(comment_id)){
            return Promise.reject({
                status: 400,
                message: "invalid comment_id"
            })
        }
        return db.query(`
        SELECT * FROM comments 
        WHERE comment_id = $1
        `, [comment_id])
        .then((result) => {
            if(result.rows.length === 0){
                return Promise.reject({
                    status: 404,
                    message: `There are no comments for this address`
                })
            } else {
        return db.query(`
        DELETE FROM comments 
        WHERE comment_id = $1
        `, [comment_id])
            }})
        .then((result) => {
            return result.rows
        })
        }
    


//looking if topic exists off topic
      // if (topic){
    //     return exports
    //       .fetchTopics()
    //       .then((topics) => {
    //         const topicNames = topics.map((topic) => topic.slug);
    //         if (!topicNames.includes(topic)) {
    //           return Promise.reject({
    //             status: 404,
    //             message: "Invalid topic",
    //           });
    //         }})}