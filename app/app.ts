import express from 'express';
import * as redis from 'redis';

export const REDIS_KEY = "messages"

export type RedisClient = redis.RedisClientType<any, any, any>;
export const createApp = (client: RedisClient) => {
    const app = express();
    app.use(express.json());

    app.get("/", (req, res) => {
        res.status(200).send("hello from express, deployed by github action to AWS lightsail") 
    })

    app.get("/crash", () => {
        console.log("server crashed");
        process.exit()
    })
    
    function fibonacci (n: number): number {
        if (n <= 1 ) return n;
        return fibonacci(n-1) + fibonacci(n-2);
    }

    app.get("/fibonacci/:n", async (req,res) => {
        console.log(process.env.pm_id);
        const n = parseInt(req.params.n, 10);
        const result = fibonacci(n)
        res.status(200).send(`Fibonacci(${n}) = ${result}`)
    })

    app.post("/messages", async (req, res) => {
        const { msg } = req.body;
        await client.lPush(REDIS_KEY, msg)
        res.status(200).send("msg added to list")
    })
    app.get("/messages",async (req, res) => {
        const msgs = await client.lRange(REDIS_KEY, 0, -1);
        res.status(200).send(msgs);
    })
    return app;
};