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
            expect(topics).toBeInstanceOf(Array)
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
})