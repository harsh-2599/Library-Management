const mongoose = require("mongoose");
const uri = 'mongodb://localhost:27017/Library'

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected...");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;