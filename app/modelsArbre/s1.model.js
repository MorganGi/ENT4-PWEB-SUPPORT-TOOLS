module.exports = (sequelize, Sequelize) => {
  const S1 = sequelize.define(
    "s1",
    {
      id_s1: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title_s1: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ind_pb: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  return S1;
};
