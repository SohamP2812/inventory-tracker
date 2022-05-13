const express = require("express");
const logger = require("morgan");
const path = require("path");
require("dotenv").config();
const cors = require("cors");
const { Sequelize } = require("sequelize");

const app = express();

app.use(express.json());

app.use(cors());

app.use(logger("dev"));

const sequelize = new Sequelize("postgresql://localhost/inventory");
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;

app.use(express.static(path.join(__dirname, "..", "views", "build")));

const inventoryRouter = require("./routes/api/inventory");
const inventoryHistoryRouter = require("./routes/api/inventory-history");

app.use("/api/inventory", inventoryRouter);
app.use("/api/inventory-history", inventoryHistoryRouter);

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "views", "build", "index.html"));
});

app.use((req, res, next) => {
  const error = new Error(`${req.originalUrl} Not Found`);
  error.status = 404;
  next(error);
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is connected on port ${PORT}`);
});
