import express from "express";
// import { ips } from "./ips.js";
const app = express();
const port = process.env.PORT || 1701;

const list = [];

app.set("trust proxy", 5);

app.get("/list", (req, res) => {
  res.json({ list });
});

function circularReplacer() {
  const seen = new WeakSet(); // object
  return (_key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
}


app.get("/hm", (req, res) => {
  const pr = parseInt(req.query.pr, 10);
  app.set("trust proxy", pr);
  res.json({ pr });
});

app.get("/", (req, res) => {
  const ok = {
    a: req.ip,
    b: req.headers["x-forwarded-for"],
    c: req.headers["cf-connecting-ip"],
    d: req.headers["x-real-ip"],
    e: req.socket.remoteAddress,
    f: req.ips,
  };
  console.log(ok);
  res.json(ok);
});


app.get("/test", (req, res) => {
  req.parent = req;
  const jsonString = JSON.stringify(req, circularReplacer());
  const json = JSON.parse(jsonString);
  console.log(json);
  res.json(json);
});

app.get("/head", (req, res) => {
  console.log(req.headers);
  res.json(req.headers);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});