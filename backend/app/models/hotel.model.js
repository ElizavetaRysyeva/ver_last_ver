module.exports = (sequelize, Sequelize) => {
  const Model = sequelize.define("hotel", {
    name: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
    },
    city: {
      type: Sequelize.STRING,
    },
    country: {
      type: Sequelize.STRING,
    },
    country_rus: {
      type: Sequelize.STRING,
    },
    propertyType: {
      type: Sequelize.STRING,
    },
    stars: {
      type: Sequelize.INTEGER,
    },
    hotel_img: {
      type: Sequelize.STRING,
    },
  });

  return Model;
};
