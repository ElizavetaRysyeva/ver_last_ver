module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define("roles", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true, // добавлено автоинкрементирование
    },
    name: {
      type: Sequelize.STRING,
    },
  });

  return Role;
};
