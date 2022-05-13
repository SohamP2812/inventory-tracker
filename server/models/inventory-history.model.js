const db = require("../index");

const InventoryHistory = db.sequelize.define(
  "inventory_history",
  {
    itemName: {
      type: db.Sequelize.STRING,
      allowNull: false,
    },
    amount: {
      type: db.Sequelize.INTEGER,
      allowNull: false,
    },
    description: {
      type: db.Sequelize.STRING,
      allowNull: false,
    },
    transactionType: {
      type: db.Sequelize.STRING,
      allowNull: false,
    },
    createdAt: { type: db.Sequelize.DATE, defaultValue: Date.now },
  },
  {
    freezeTableName: true,
  }
);

InventoryHistory.sync();

module.exports = InventoryHistory;
