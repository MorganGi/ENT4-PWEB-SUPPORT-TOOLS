const config = require("../Config/dbArbre.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: false,
  define: {
    //prevent sequelize from pluralizing table names
    freezeTableName: true,
  },
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.pb = require("./pb.model.js")(sequelize, Sequelize);
db.s1 = require("./s1.model.js")(sequelize, Sequelize);
db.s2 = require("./s2.model.js")(sequelize, Sequelize);
db.solutions = require("./solutions.model.js")(sequelize, Sequelize);

db.pb.hasMany(db.s1, { foreignKey: "ind_pb" });
db.s1.hasMany(db.s2, { foreignKey: "ind_s1" });
db.s2.hasMany(db.solutions, { foreignKey: "ind_s2" });
db.s1.hasMany(db.solutions, { foreignKey: "ind_s11" });

// db.role.belongsToMany(db.user, {
//   through: "user_roles",
//   foreignKey: "roleId",
//   otherKey: "userId"
// });
// db.user.belongsToMany(db.role, {
//   through: "user_roles",
//   foreignKey: "userId",
//   otherKey: "roleId"
// });

// db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
