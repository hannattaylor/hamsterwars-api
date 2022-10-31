const { MongoClient } = require("mongodb");
const DB = process.env.ATLAS_URI;

const client = new MongoClient(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let _db;

module.exports = {
  connectToServer: function (callback) {
    client.connect((err, db) => {
      if (db) {
        _db = db.db("hamsterwarsDB");
      }
      return callback(err);
    });
  },
  getDb: function () {
    return _db;
  },
};
