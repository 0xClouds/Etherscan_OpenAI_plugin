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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
require("dotenv").config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: "https://chat.openai.com" }));
app.use(express_1.default.json());
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const HOST_URL = "https://api.etherscan.io/api";
app.get("/balance", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const account = req.query.account;
    console.log(`Queryng Ether balance of ${account}`);
    const response = yield fetch(`${HOST_URL}?module=account&action=balance&address=${account}&tag=latest&apikey=${ETHERSCAN_API_KEY}`);
    const body = yield response.json();
    res.json(body);
}));
app.get("/nfts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const account = req.query.account;
    console.log(`Querying NFT balance of ${account}`);
    const response = yield fetch(`${HOST_URL}?module=account&action=addresstokennftbalance&address=${account}&page=1&offset=10&apikey=${ETHERSCAN_API_KEY}`);
    const body = yield response.json();
    res.json(body);
}));
app.get("/token_balance", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const account = req.query.account;
    const contract = req.query.contract;
    console.log(`Querying ERC-20 tokens of ${account}`);
    const response = yield fetch(`${HOST_URL}?module=account&action=tokenbalance&contractaddress=${contract}&address=${account}&tag=latest&apikey=${ETHERSCAN_API_KEY}`);
    const body = yield response.json();
    res.json(body);
}));
app.get("/.well-known/ai-plugin.json", (req, res) => {
    fs_1.default.readFile("./.well-known/ai-plugin.json", "utf8", (err, data) => {
        if (err)
            throw err;
        res.status(200).type("json").send(data);
    });
});
app.get("/openapi.yaml", (req, res) => {
    fs_1.default.readFile("./openapi.yaml", "utf8", (err, data) => {
        if (err)
            throw err;
        res.status(200).type("yaml").send(data);
    });
});
app.listen(5001, "0.0.0.0", () => {
    console.log("Server started on port 5001");
});
