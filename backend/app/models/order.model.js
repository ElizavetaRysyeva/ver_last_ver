module.exports = (sequelize, Sequelize) => {
  const Model = sequelize.define("order", {
    user_id: {
      type: Sequelize.INTEGER,
      references: sequelize.user,
    },
    room_id: {
      type: Sequelize.INTEGER,
      references: sequelize.rooms,
    },

    hotel_id: {
      type: Sequelize.INTEGER,
      references: sequelize.hotels,
    },
    status: {
      type: Sequelize.INTEGER,
    },
    status_name: {
      type: Sequelize.STRING,
    },
    cluster: {
      type: Sequelize.INTEGER,
    },
  });

  Model.statusEnum = [
    { val: 1, name: "В корзине" },
    { val: 2, name: "Оплачен" },
  ];

  Model.associate = (models) => {
    Model.belongsTo(models.User, { foreignKey: "user_id" });
    Model.belongsTo(models.Room, { foreignKey: "room_id" });
    Model.belongsTo(models.Hotel, { foreignKey: "hotel_id" });
  };
  

  return Model;
};
