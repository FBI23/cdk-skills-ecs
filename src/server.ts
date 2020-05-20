const express = require("express");

const app = express();

const fetcher = require("node-fetch");

console.log("BOOTING SERVER");

// @ts-ignore
app.get("/", async (req, res) => {
  const { ip } = await (
    await fetcher("https://api.ipify.org?format=json")
  ).json();
  console.log({ ip });
  res.send(`Hello Boomer: ${ip}`);
});
// @ts-ignore
app.get("/health-check", (req, res, next) => {
  res.sendStatus(200);
});

app.listen(3000, "0.0.0.0");
