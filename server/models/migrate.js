var db = require("../index.js");
db.sequelize.sync().then(() => {
  process.kill(process.pid, "SIGTERM");
});
