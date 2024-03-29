const request = require("supertest");
const app = require("../app")
const testData = require('../db/data/test-data/index')
const seed = require('../db/seeds/seed')
const db = require('../db/connection')
const endpointsJson = require("../endpoints.json")

beforeEach(()=> seed(testData))
afterAll(()=> db.end())

describe("app", () => {
    describe("GET /api", () => {
        test('200: GET - all available endpoints of the api ', () => {
            return request(app)
            .get("/api")
            .expect(200)
            .then(({body}) => {
                const { endpoints } = body
                expect(endpoints).toEqual(endpointsJson)
            })
        });
        test('404: Error issued for invalid endpoint ', () => {
            return request(app)
            .get("/Wrong_Endpoint")
            .expect(404)
            .then(({body}) => {
                expect(body.message).toBe("invalid pathway")
            })
        });

    })

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
            test('200: GET - an articles array of article objects, each of which should have the following properties: author, title, article_id, topic, created_at, votes, article_img_url', () => {
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
            test('200: GET -  it must include comment_count', () => {
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
            
        })
        test('200: filter is valid yet no articles but not a bad request', () => {
            return request(app)
            .get("/api/articles")
            .query({sort_by: "author", order: "ASC", topic: "fruit"})
            .expect(200)
            .then(({body}) => {
                const {articles} = body;
                expect(articles.length).toBe(0)
                expect(body).toEqual({articles: []})
            
        })
    })
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
        test('200: responds with article object containing coment count ', () => {
            return request(app)
            .get('/api/articles/3')
            .expect(200)
            .then(({body}) => {
                const { article } = body
                expect(article.comment_count).toBe(2)
            })
        });
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
        describe('PATCH /api/articles/:article_id', () => {
            test('200: updates votes to include incremental counting', () => {
                return request(app)
                .patch("/api/articles/1")
                .send({ inc_votes: 2 })
                .expect(200)
                .then(({body}) => {
                    const updatedArticle = body
                    expect(updatedArticle).toEqual({ 
                    article_id: 1,
                    title: 'Living in the shadow of a great man',
                    topic: 'mitch',
                    author: 'butter_bridge',
                    body: 'I find this existence challenging',
                    created_at: "2020-07-09T20:11:00.000Z",
                    votes: 102,
                    article_img_url:
                      'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',

                    })
                }) 
            });
        })

        describe('GET: /api/users', () => {
            test('200: responds with users with properties of username, name and avatar_url ', () => {
                return request(app)
                .get("/api/users")
                .expect(200)
                .then(({body}) => {
                    const {users} = body
                    expect(users).toHaveLength(4)
                    users.forEach((user) => {
                        expect(user).toMatchObject({
                            username: expect.any(String),
                            name: expect.any(String),
                            avatar_url: expect.any(String)
                        })
                    })
                    })
                });
        })
        describe("DELETE /api/comments/:comment_id", () => {
            test('204: Deletes and removes comments related to an article from a database ', () => {
                return request(app)
                .delete('/api/comments/1')
                .expect(204)
                .then(({body}) => {
                    expect(body).toEqual({})
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
            .query({sort_by: "article_id", order: "inValidOrder", topic: "mitch"})
            .expect(400)
            .then(({body}) => {
                expect(body.message).toBe("Invalid order query")
        });
    })
        
        test('400: Should return an error for invalid article_id', () => {
            return request(app)
            .patch("/api/articles/invalid_article_id")
            .send({
                inc_votes: 1,
            })
            .expect(400)
            .then(({body}) => {
                expect(body.message).toBe("invalid article_id")
            })
        })
        test('404: Should return an error for valid but not existent article_id', () => {
            return request(app)
            .patch("/api/articles/123456")
            .send({
                inc_votes: 1,
            })
            .expect(404)
            .then(({body}) => {
                expect(body.message).toBe("article id not found")
            })
        })
        test('400: Should return an error for votes not being a number', () => {
            return request(app)
            .patch("/api/articles/1")
            .send({
                inc_votes: 'notANumber',
            })
            .expect(400)
            .then(({body}) => {
                expect(body.message).toBe("invalid voting")
            })
        })
        test('400: Should return an error for incorrect key', () => {
            return request(app)
            .patch("/api/articles/1")
            .send({
                notVotesKey: 3,
            })
            .expect(400)
            .then(({body}) => {
                expect(body.message).toBe("invalid voting")
            })
        })
        test('DELETE - 400: returns an error for invalid comment id', () => {
            return request(app)
            .delete("/api/comments/banana")
            .expect(400)
            .then(({body}) => {
                expect(body.message).toBe("invalid comment_id")

            })
        })
        test('DELETE - 404: returns an error for valid comment_id that is non-existent', () => {
            return request(app)
            .delete("/api/comments/31353522")
            .expect(404)
            .then(({body}) => {
                expect(body.message).toBe(`There are no comments for this address`)

            })
        })
    })
    
})





