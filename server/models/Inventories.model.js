const db = require("../index");

const Inventories = db.sequelize.define(
  "inventories",
  {
    id: {
      type: db.Sequelize.UUID,
      defaultValue: db.Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    creator: {
      type: db.Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: db.Sequelize.STRING,
      allowNull: false,
    },
    createdAt: { type: db.Sequelize.DATE, defaultValue: Date.now },
  },
  {
    freezeTableName: true,
  }
);

// Inventories.sync();

module.exports = Inventories;
