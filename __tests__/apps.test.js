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
    describe("GET /api/articles/:article_id", () => {
        test('200: GET - an articles array of article objects, each of which should have the following properties: author, title, article_id, topic, created_at, votes, article_img_url, comment_count', () => {
            return request(app)
            .get("/api/articles/3")
            .expect(200)
            .then(({body}) => {
                expect(body.article).toEqual({
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

    })
    
})

