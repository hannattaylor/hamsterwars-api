const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config({ path: "./config.env" });

const port = process.env.PORT || 1227;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(require("./routes/hamsters"));
app.use(require("./routes/matches"));

const dbo = require("./db/connect");

app.listen(port, () => {
  dbo.connectToServer((err) => {
    if (err) console.error(err);
    console.log("Server is running on port", port);
  });
});
