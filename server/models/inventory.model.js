const db = require("../index");

const Inventory = db.sequelize.define(
  "inventory",
  {
    itemName: {
      type: db.Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    amountInStock: {
      type: db.Sequelize.INTEGER,
      allowNull: false,
    },
    description: {
      type: db.Sequelize.STRING,
      allowNull: false,
    },
    createdAt: { type: db.Sequelize.DATE, defaultValue: Date.now },
  },
  {
    freezeTableName: true,
  }
);

Inventory.sync();

module.exports = Inventory;
