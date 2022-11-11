const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config({ path: "./config.env" });

const port = process.env.PORT || 1227;

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "50mb", extended: true }));
app.use(require("./routes/hamsters"));
app.use(require("./routes/matches"));
app.use(require("./routes/images"));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const dbo = require("./db/connect");

app.get("/status", (req, res) => res.sendStatus(200));

app.listen(port, () => {
  dbo.connectToServer((err) => {
    if (err) console.error(err);
    console.log("Server is running on port", port);
  });
});
