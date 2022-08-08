module.exports = (sequelize, Sequelize) => {
  const Pb = sequelize.define(
    "pb",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title_pb: {
        type: Sequelize.STRING,
      },
      techno: {
        type: Sequelize.STRING,
      },
    },
    {
      timestamps: false,
    }
  );

  return Pb;
};
