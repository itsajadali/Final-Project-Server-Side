const dotenv = require("dotenv");
const mongoose = require("mongoose");

process.on("unhandledException", (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const app = require("./app");

const DB = process.env.DATABASE;

const connectToDB = async () => {
  try {
    await mongoose.connect(DB, {
      autoIndex: true,
    });
    console.log("Connected to Mongodb Atlas");
  } catch (error) {
    console.error(error);
  }
};
connectToDB();

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}... in ${process.env.NODE_ENV} mode`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
