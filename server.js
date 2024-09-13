import express from "express";
import path from "path";
const app = express();
const port = 3002;

app.use("/assets", express.static("./dist/assets"));

app.get("/", (req, res) => {
  // console.log("🚀 ~ app.get ~ req:", req);
  res.sendFile(path.resolve("dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
