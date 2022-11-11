const express = require("express");

const hamsterRoutes = express.Router();

// Connecting to database
const dbo = require("../db/connect");

// Converts the id from a string to an object-id(_id);
const ObjectId = require("mongodb").ObjectId;

//
// ****** ENDPOINTS FOR THE HAMSTER-API ****** //
//
// ** GET ALL HAMSTER-OBJECTS **
hamsterRoutes.route("/hamsters").get((req, res) => {
  try {
    let db_connect = dbo.getDb();
    db_connect
      .collection("hamsters")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        res.status(200).json(result);
      });
  } catch {
    res.status(500);
  }
});

// ** GET A RANDOM HAMSTER-OBJECT **
hamsterRoutes.route("/hamsters/random").get((req, res) => {
  try {
    let db_connect = dbo.getDb();
    db_connect
      .collection("hamsters")
      .aggregate([{ $sample: { size: 1 } }])
      .toArray(function (err, result) {
        if (err) throw err;
        res.status(200).json(result);
      });
  } catch {
    res.status(500);
  }
});

// ** GET A HAMSTER WITH A SPECIFIC ID - 404 **
hamsterRoutes.route("/hamsters/:id").get((req, res) => {
  try {
    let db_connect = dbo.getDb();
    let idQuery = { _id: ObjectId(req.params.id) };
    db_connect.collection("hamsters").findOne(idQuery, function (err, result) {
      if (err) {
        throw err;
      }
      if (result) {
        res.json(result);
      } else {
        res.status(404).json({ hamster: "finns inteee" });
      }
    });
  } catch {
    res.status(500);
  }
});

// ** ADD NEW HAMSTER TO THE DB **
hamsterRoutes.route("/hamsters").post((req, res) => {
  try {
    let { name, age, favFood, loves, imgName, wins, defeats, games } = req.body;
    let db_connect = dbo.getDb();
    let newHamster = {
      name: name,
      age: age,
      favFood: favFood,
      loves: loves,
      imgName: imgName,
      wins: wins,
      defeats: defeats,
      games: games,
    };

    // Check so that every key values contains info and is not null or an empty string
    const checkProps = Object.values(newHamster).every(
      (v) => v !== null && v !== ""
    );

    if (checkProps) {
      db_connect
        .collection("hamsters")
        .insertOne(newHamster, function (err, result) {
          if (err) throw err;
          res.json(result);
        });
    } else {
      res.status(400).send("Felfelfel");
    }
  } catch {
    res.status(500);
  }
});

// ** UPDATE HAMSTER-OBJECT (E.G WHEN WINNING OR LOOSING A MATCH) **
hamsterRoutes.route("/hamsters/:id").put((req, res) => {
  try {
    let { wins, defeats, games } = req.body;
    let db_connect = dbo.getDb();
    let idQuery = { _id: ObjectId(req.params.id) };
    let updatedHamster = {
      $set: {
        wins: wins,
        defeats: defeats,
        games: games,
      },
    };
    db_connect
      .collection("hamsters")
      .updateOne(idQuery, updatedHamster, (err, result) => {
        if (err) throw err;
        if (result) {
          res.sendStatus(200);
        } else {
          res.sendStatus(404);
        }
      });
  } catch {
    res.status(500);
  }
});

// ** DELETE HAMSTER **
hamsterRoutes.route("/hamsters/:id").delete((req, res) => {
  let db_connect = dbo.getDb();
  let idQuery = { _id: ObjectId(req.params.id) };
  db_connect.collection("hamsters").deleteOne(idQuery, (err, response) => {
    if (err) throw err;
    res.status(200).send(response);
  });
});

// ** GET TOP 5 WINNERS (HAMSTER-OBJECTS) **
hamsterRoutes.route("/winners").get((req, res) => {
  try {
    let db_connect = dbo.getDb();
    db_connect
      .collection("hamsters")
      .find()
      .sort({ wins: -1 })
      .limit(5)
      .toArray((err, result) => {
        if (err) throw err;
        res.status(200).json(result);
      });
  } catch {
    res.status(500);
  }
});

// ** GET TOP 5 LOSERS (HAMSTER-OBJECTS) **
hamsterRoutes.route("/losers").get((req, res) => {
  try {
    let db_connect = dbo.getDb();
    db_connect
      .collection("hamsters")
      .find()
      .sort({ defeats: -1 })
      .limit(5)
      .toArray((err, response) => {
        if (err) throw err;
        res.status(200).send(response);
      });
  } catch {
    res.status(500);
  }
});

module.exports = hamsterRoutes;
