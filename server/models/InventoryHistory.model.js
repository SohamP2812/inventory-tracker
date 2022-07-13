const db = require("../index");

const InventoryHistory = db.sequelize.define(
  "inventory_history",
  {
    inventoryID: {
      type: db.Sequelize.UUID,
      defaultValue: db.Sequelize.UUIDV4,
      allowNull: false,
    },
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

// InventoryHistory.sync();

module.exports = InventoryHistory;
