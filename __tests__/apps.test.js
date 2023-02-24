const request = require("supertest");
const app = require("../app")
const testData = require('../db/data/test-data/index')
const seed = require('../db/seeds/seed')
const db = require('../db/connection')

beforeEach(()=> seed(testData))
afterAll(()=> db.end())

describe("app", () => {
    describe("GET /api/topics", () => {
        test('200: GET - an array of topic objects, each of which should have the following properties slug, description', () => {
            return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({body}) => {
                const {topics} = body
            expect(topics).toHaveLength(3)
            topics.forEach((topic) => {
                expect(topic).toMatchObject({
                    description: expect.any(String),
                    slug: expect.any(String)
                })
            })
            })
        });
        
      
    })
    describe("GET /api/articles", () => {
            test('200: GET - an articles array of article objects, each of which should have the following properties: author, title, article_id, topic, created_at, votes, article_img_url, comment_count', () => {
                return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({body}) => {
                    const {articles} = body
                expect(articles).toHaveLength(12)
                articles.forEach((article) => {
                    expect(article).toMatchObject({
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        topic: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(Number)
                    })
                })
                })
            });
            test('200: Responds with articles sorted by date in descending order. ', () => {
                return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({body}) => {
                    const {articles} = body;
                    expect(articles).toBeSorted({ key: 'created_at', descending: true})
                })
                
            });
            
          
        })
    describe("GET /api/articles (Query)", () => {
        test('200: Responds with articles sorted by any valid column ', () => {
            return request(app)
            .get("/api/articles")
            .query({sort_by: 'title'})
            .expect(200)
            .then(({body}) => {
                const {articles} = body;
                expect(articles).toBeSorted({ key: 'title', descending: true})
            })
            
        });
        test('200: Responds with articles changed to ordered ascending ', () => {
            return request(app)
            .get("/api/articles")
            .query({sort_by: "author", order: "ASC"})
            .expect(200)
            .then(({body}) => {
                const {articles} = body;
                expect(articles).toBeSorted({ key: 'author', descending: false})
            })
            
        });
        test('200: Responds with articles filtered by topic', () => {
            return request(app)
            .get("/api/articles")
            .query({sort_by: "author", order: "ASC", topic: "mitch"})
            .expect(200)
            .then(({body}) => {
                const {articles} = body;
                articles.forEach((article) => {
                    expect(article).toMatchObject({
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: "mitch",
                    author: expect.any(String),
                    body: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(Number)

                    })
                })
            })
            
        });
    })
    
    
    describe("GET /api/articles/:article_id", () => {
        test('200: GET - an articles array of article objects, each of which should have the following properties: author, title, article_id, topic, created_at, votes, article_img_url, comment_count', () => {
            return request(app)
            .get("/api/articles/3")
            .expect(200)
            .then(({body}) => {
                expect(body.article).toMatchObject({
                    article_id: 3,
                    title: 'Eight pug gifs that remind me of mitch',
                    topic: 'mitch',
                    author: 'icellusedkars',
                    body: 'some gifs',
                    created_at: "2020-11-03T09:12:00.000Z",
                article_img_url:'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                    votes: 0,
                });
            })
        })
        })
        describe(" GET /api/articles/:article_id/comments", () => {
            test('200 GET - an article comments array, each of which should contain comment_id, votes, created_at, author, body, article_id in descending order', () => {
                return request(app)
                .get("/api/articles/3/comments")
                .expect(200)
                .then(({body}) => {
                    const comments = body.comments
                    expect(comments.length).toBe(2)
                    comments.forEach((comment) => {
                        expect(comment).toMatchObject({
                            comment_id: expect.any(Number),
                            votes: expect.any(Number),
                            created_at: expect.any(String),
                            author: expect.any(String),
                            body: expect.any(String),
                            article_id: expect.any(Number)
                        })
                    })
                })
            });
            test('200: Responds with comments sorted by most recent in descending order. ', () => {
                return request(app)
                .get("/api/articles/3/comments")
                .expect(200)
                .then(({body}) => {
                    const comment = body.comments;
                    expect(comment).toBeSorted({ key: 'created_at', descending: true})
                })
                
            });
        })
        describe('POST /api/articles/:article_id/comments', () => {
            test(' 201: Responds with a posted comment with username and body ', () => {
                return request(app)
                .post("/api/articles/3/comments")
                .send({ username: "icellusedkars", body: "this is a new comment"})
                .expect(201)
                .then(({body}) => {
                    const {comment} = body
                    expect(comment).toMatchObject({
                        comment_id: 19,
                        author: "icellusedkars" ,
                        body: "this is a new comment" ,
                        votes: 0,
                        article_id: 3,
                        created_at: expect.any(String)
                    })

                })
                
            });
            test(' 201: ignores unnecessary properties and responds with a posted comment with username and body ', () => {
                return request(app)
                .post("/api/articles/3/comments")
                .send({ username: "icellusedkars", body: "this is a new comment", fruit: "apple"})
                .expect(201)
                .then(({body}) => {
                    const {comment} = body
                    expect(comment).toMatchObject({
                        comment_id: 19,
                        author: "icellusedkars" ,
                        body: "this is a new comment" ,
                        votes: 0,
                        article_id: 3,
                        created_at: expect.any(String)
                    })

                })
                
            });
        })

    describe('Error handling', () => {
        test('404: Should return error - invalid pathway ', () => {
            return request(app)
            .get("/api/notTopics")
            .expect(404)
            .then(({body}) => {
            expect(body.message).toBe("invalid pathway")
        
            })
        });
        test('400: Should return an error for invalid article_id', () => {
            return request(app)
            .get("/api/articles/invalid_article_id")
            .expect(400)
            .then(({body}) => {
                expect(body.message).toBe("invalid article_id")
            })
        })
        test('404: Should return an error for valid but not existent article_id', () => {
            return request(app)
            .get("/api/articles/123456")
            .expect(404)
            .then(({body}) => {
                expect(body.message).toBe("article id not found")
            })
        })
        test('400: Should return an error for invalid article_id', () => {
            return request(app)
            .get("/api/articles/invalid_article_id/comments")
            .expect(400)
            .then(({body}) => {
                expect(body.message).toBe("invalid article_id")
            })
        })
        test('404: Should return an error for valid but not existent article_id', () => {
            return request(app)
            .get("/api/articles/123456/comments")
            .expect(404)
            .then(({body}) => {
                expect(body.message).toBe("article id not found")
            })
        })
        test('404: Should return error - invalid pathway ', () => {
            return request(app)
            .get("/api/articles/3/commentsssssss")
            .expect(404)
            .then(({body}) => {
            expect(body.message).toBe("invalid pathway")
        
            })
        });
        test('400: Should return an error for invalid article_id', () => {
            return request(app)
            .post("/api/articles/invalid_article_id/comments")
            .expect(400)
            .then(({body}) => {
                expect(body.message).toBe("invalid article_id")
            })
        })
        test('404: Should return an error for valid but not existent article_id', () => {
            return request(app)
            .post("/api/articles/123456/comments")
            .send({
                username: "butter_bridge",
                body: "invalid article_id error"
            })
            .expect(404)
            .then(({body}) => {
                expect(body.message).toBe("article id not found")
            })
        })
        
        test('400: should return an error if a missing username ', () => {
            return request(app)
            .post("/api/articles/3/comments")
            .send({body: "no username with this comment"})
            .expect(400)
            .then(({body}) => {
                expect(body.message).toBe("username or comment missing")
            })
        })
        test('400: should return an error if a missing the body of comment ', () => {
            return request(app)
            .post("/api/articles/3/comments")
            .send({username: "butter_bridge"})
            .expect(400)
            .then(({body}) => {
                expect(body.message).toBe("username or comment missing")
            })
        })
        test('404: Should return an error for non existent user', () => {
            return request(app)
            .post("/api/articles/3/comments")
            .send({
                username: "bananarama",
                body: "I am not a user"
            })
            .expect(404)
            .then(({body}) => {
                expect(body.message).toBe("This is not a user")
            })
        })
        test('400: Should return error for invalid sort query ', () => {
            return request(app)
            .get("/api/articles")
            .query({sort_by: "inValidSortBy", order: "ASC", topic: "mitch"})
            .expect(400)
            .then(({body}) => {
                expect(body.message).toBe("Invalid sort query")
            })
        });
        test('400: Should return error for invalid order query ', () => {
            return request(app)
            .get("/api/articles")
            .query({sort_by: "artile_id", order: "inValidOrder", topic: "mitch"})
            .expect(400)
            .then(({body}) => {
                expect(body.message).toBe("Invalid sort query")
        });
    })
         test('404: should return an error for invalid topic ', () => {
        return request(app)
        .get("/api/articles")
        .query({sort_by: "article_id", order: "DESC", topic: "inValidTopic"})
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe("Invalid topic")
    });
})
    })
    
})



