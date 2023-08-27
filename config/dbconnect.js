const mongoose = require("mongoose");



const dbconnect =() => {
    mongoose
    .connect(process.env.dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });
}
module.exports = dbconnect
