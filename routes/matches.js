const express = require("express");

const matchesRoutes = express.Router();

const dbo = require("../db/connect");

const ObjectId = require("mongodb").ObjectId;

// ***** ENDPOINTS FOR HAMSTERWAR MATCHES ***** //

// ** ADD/POST NEW MATCH (WITH WINNER AND LOSER ID) **
matchesRoutes.route("/matches").post((req, res) => {
  try {
    const { winnerId, loserId } = req.body;
    let db_connect = dbo.getDb();
    let newMatch = {
      winnerId: winnerId,
      loserId: loserId,
    };
    // Check so that every key values contains info and is not null or an empty string
    const checkProps = Object.values(newMatch).every(
      (v) => v !== null && v !== ""
    );

    if (checkProps) {
      db_connect.collection("matches").insertOne(newMatch, (err, response) => {
        if (err) throw err;
        res.status(200).json(response);
      });
    } else {
      res.status(400).send("wrong data");
    }
  } catch {
    res.json(500);
  }
});

// ** GET AMOUNT OF DOCUMENTS IN MATCHES ** //
matchesRoutes.route("/matches").get((req, res) => {
  try {
    let db_connect = dbo.getDb();
    db_connect
      .collection("matches")
      .find({})
      .toArray((err, result) => {
        if (err) throw err;
        res.status(200).json(result.length);
      });
  } catch {
    res.status(500);
  }
});

// ** GET ALL MATCHES (10/page) **
matchesRoutes.route("/matches/:page").get((req, res) => {
  const numPerPage = 10;
  const pageNum = req.params.page;
  try {
    let db_connect = dbo.getDb();
    db_connect
      .collection("matches")
      .find({})
      .sort({ _id: 1 })
      .skip(pageNum * numPerPage)
      .limit(numPerPage)
      .toArray((err, result) => {
        if (err) throw err;
        res.status(200).json(result);
      });
  } catch {
    res.status(500);
  }
});

// ** GET MATCH WITH SPECIFIC ID **
matchesRoutes.route("/matches/:id").get((req, res) => {
  try {
    let db_connect = dbo.getDb();
    let idQuery = ObjectId(req.params.id);
    db_connect.collection("matches").findOne(idQuery, (err, result) => {
      if (err) throw err;
      res.status(200).json(result);
    });
  } catch {
    res.status(500);
  }
});

// ** DELETE ONE MATCH **
matchesRoutes.route("/matches/:id").delete((req, res) => {
  try {
    let db_connect = dbo.getDb();
    let idQuery = { _id: ObjectId(req.params.id) };

    db_connect.collection("matches").deleteOne(idQuery, (err, response) => {
      if (err) throw err;
      res.status(200).json(response);
    });
  } catch {
    res.status(500);
  }
});

// ** FIND MATCHWINNERS WITH A SPECIFIC HAMSTER-ID **
matchesRoutes.route("/matchwinners/:id").get((req, res) => {
  try {
    let db_connect = dbo.getDb();
    let idQuery = req.params.id;
    db_connect
      .collection("matches")
      .find({ winnerId: idQuery })
      .toArray((err, result) => {
        if (err) throw err;
        if (result.length === 0) {
          res.status(404).send("hamstern har inte vunnit någon match... :(");
        } else {
          res.status(200).json(result);
        }
      });
  } catch {
    res.status(500);
  }
});

module.exports = matchesRoutes;
