const db = require("../index");

const Inventory = db.sequelize.define(
  "inventory",
  {
    itemName: {
      type: db.Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    inventoryID: {
      type: db.Sequelize.UUID,
      defaultValue: db.Sequelize.UUIDV4,
      allowNull: false,
    },
    amountInStock: {
      type: db.Sequelize.INTEGER,
      allowNull: false,
    },
    description: {
      type: db.Sequelize.STRING,
      allowNull: false,
    },
    deleted: {
      type: db.Sequelize.BOOLEAN,
      defaultValue: false,
    },
    deletedDescription: {
      type: db.Sequelize.STRING,
      defaultValue: "",
    },
    createdAt: { type: db.Sequelize.DATE, defaultValue: Date.now },
  },
  {
    freezeTableName: true,
  }
);

// Inventory.sync();

module.exports = Inventory;
