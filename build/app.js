"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = exports.REDIS_KEY = void 0;
const express_1 = __importDefault(require("express"));
exports.REDIS_KEY = "messages";
const createApp = (client) => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.get("/", (req, res) => {
        res.status(200).send("hello from express");
    });
    app.post("/messages", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { msg } = req.body;
        yield client.lPush(exports.REDIS_KEY, msg);
        res.status(200).send("msg added to list");
    }));
    app.get("/messages", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const msgs = yield client.lRange(exports.REDIS_KEY, 0, -1);
        res.status(200).send(msgs);
    }));
    return app;
};
exports.createApp = createApp;
