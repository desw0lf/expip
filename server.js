import express from "express";
import { ips } from "./ips.js";
const app = express();
const port = process.env.PORT || 1701;

app.set("trust proxy", ["loopback", ...ips]);

function circularReplacer() {
  const seen = new WeakSet(); // object
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
}

app.get("/", (req, res) => {
  const ok = {
    a: req.ip,
    b: req.headers["x-forwarded-for"],
    c: req.headers["cf-connecting-ip"]
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