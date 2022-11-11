const express = require("express");

const imageRoutes = express.Router();

const dbo = require("../db/connect");

const ObjectId = require("mongodb").ObjectId;

// ******** ADD IMG TO DB ******** //
imageRoutes.route("/addimage").post((req, res) => {
  const { imgName, base64 } = req.body;

  try {
    let db_connect = dbo.getDb();

    let newImage = {
      imgName: imgName,
      base64: base64,
    };
    db_connect.collection("images").insertOne(newImage, (err, response) => {
      if (err) throw err;
      res.status(200).json({ msg: response });
    });
  } catch (err) {
    console.error(err);
  }
});

// ******** GET IMG FROM DB ******** //
imageRoutes.route("/getimage/:imgname").get((req, res) => {
  const imgName = req.params.imgname;

  db_connect = dbo.getDb();
  try {
    db_connect
      .collection("images")
      .findOne({ imgName: imgName }, (err, response) => {
        if (err) throw err;
        res.status(200).json(response);
      });
  } catch (err) {
    console.err(err);
  }
});

module.exports = imageRoutes;
