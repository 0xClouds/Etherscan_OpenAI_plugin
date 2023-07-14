import express, { Request, Response } from "express";
import cors from "cors";
import fs from "fs";
require("dotenv").config();

const app = express();
app.use(cors({ origin: "https://chat.openai.com" }));
app.use(express.json());

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const HOST_URL = "https://api.etherscan.io/api";

app.get("/balance", async (req, res) => {
  const account = req.query.account;
  console.log(`Queryng Ether balance of ${account}`);
  const response = await fetch(
    `${HOST_URL}?module=account&action=balance&address=${account}&tag=latest&apikey=${ETHERSCAN_API_KEY}`
  );
  const body = await response.json();
  res.json(body);
});

app.get("/nfts", async (req, res) => {
  const account = req.query.account;
  console.log(`Querying NFT balance of ${account}`);
  const response = await fetch(
    `${HOST_URL}?module=account&action=addresstokennftbalance&address=${account}&page=1&offset=10&apikey=${ETHERSCAN_API_KEY}`
  );
  const body = await response.json();
  res.json(body);
});

app.get("/token_balance", async (req, res) => {
  const account = req.query.account;
  const contract = req.query.contract;
  console.log(`Querying ERC-20 tokens of ${account}`);
  const response = await fetch(
    `${HOST_URL}?module=account&action=tokenbalance&contractaddress=${contract}&address=${account}&tag=latest&apikey=${ETHERSCAN_API_KEY}`
  );
  const body = await response.json();
  res.json(body);
});

app.get("/.well-known/ai-plugin.json", (req: Request, res: Response) => {
  fs.readFile("./.well-known/ai-plugin.json", "utf8", (err, data) => {
    if (err) throw err;
    res.status(200).type("json").send(data);
  });
});

app.get("/openapi.yaml", (req: Request, res: Response) => {
  fs.readFile("./openapi.yaml", "utf8", (err, data) => {
    if (err) throw err;
    res.status(200).type("yaml").send(data);
  });
});

app.listen(5001, "0.0.0.0", () => {
  console.log("Server started on port 5001");
});
