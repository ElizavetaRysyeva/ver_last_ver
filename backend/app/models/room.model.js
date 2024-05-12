module.exports = (sequelize, Sequelize) => {
  const Model = sequelize.define("room", {
    hotel_id: {
      type: Sequelize.INTEGER,
      references: sequelize.hotels,
    },
    category: {
      type: Sequelize.STRING,
    },
    category_rus: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    rate_description: {
      type: Sequelize.STRING,
    },
    price: {
      type: Sequelize.INTEGER,
    },
    max_count: {
      type: Sequelize.INTEGER,
    },
    room_img: {
      type: Sequelize.STRING,
    },
  });

  Model.associate = (models) => {
    Model.belongsTo(models.Hotel, { foreignKey: "hotel_id" });
  };
  
  return Model;
};
