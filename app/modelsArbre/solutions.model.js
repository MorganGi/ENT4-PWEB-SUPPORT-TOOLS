module.exports = (sequelize, Sequelize) => {
  const Solutions = sequelize.define(
    "solutions",
    {
      id_sol: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      text: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ind_s2: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
  return Solutions;
};