module.exports = (sequelize, Sequelize) => {
  const Start = sequelize.define("start", {
    started: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
  });

  return Start;
};
