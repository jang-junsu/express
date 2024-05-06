import request from "supertest";
import { RedisClient, createApp, REDIS_KEY } from "./app"
import * as redis from "redis";

let app: any;
let client: RedisClient;

const REDIS_URL="redis://default:test_env@localhost:6380";

beforeAll(async() => {
    client = redis.createClient({url: REDIS_URL });
    await client.connect();
    app = createApp(client);
})

beforeEach(async() => {
    await client.flushDb();
})

afterAll(async() => {
    await client.flushDb();
    await client.quit();
})

describe("POST /messages", () => {
    it("respond with a success message",async () => {
        const res = await request(app)
        .post("/messages")
        .send({ msg: "test with redis"});

        expect(res.statusCode).toBe(200)
        expect(res.text).toBe("msg added to list")
    })
})

describe("GET /messages", () => {
    it("respond with messages",async () => {
        const res = await request(app).get("/messages")
        
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual([]);
    })
})
