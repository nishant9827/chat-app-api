const mongoose = require("mongoose");
const dbUrl = process.env.MONGODBURL;

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 30000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongDb connection error"));
db.once("open", () => {
  console.log("Connected to MongoDb");
});
module.exports = mongoose;
