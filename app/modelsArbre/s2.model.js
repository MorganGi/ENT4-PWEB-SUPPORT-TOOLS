module.exports = (sequelize, Sequelize) => {
  const S2 = sequelize.define(
    "s2",
    {
      id_s2: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title_s2: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ind_s1: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  S2.association = (models) => {
    S2.hasMany(models.solutions, {
      onDelete: "cascade",
    });
  };

  return S2;
};
