const db = require("../index");

const User = db.sequelize.define(
  "users",
  {
    id: {
      type: db.Sequelize.UUID,
      defaultValue: db.Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: db.Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    username: {
      type: db.Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    hashed_password: {
      type: db.Sequelize.STRING,
      allowNull: false,
    },
    createdAt: { type: db.Sequelize.DATE, defaultValue: Date.now },
  },
  {
    freezeTableName: true,
  }
);

module.exports = User;
