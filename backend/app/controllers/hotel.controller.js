const db = require("../models");
const Hotel = db.hotels;
const Op = db.Sequelize.Op;

// Create and Save a new Hotel
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Hotel
  const obj = {
    name: req.body.name,
    address: req.body.address,
    city: req.body.city,
    country: req.body.country,
    country_rus: req.body.country_rus,
    propertyType: req.body.propertyType,
    stars: req.body.stars,
    hotel_img: req.body.hotel_img,
  };

  // Save Hotel in the database
  Hotel.create(obj)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Hotel.",
      });
    });
};

// Retrieve all Hotels from the database.
exports.findAll = (req, res) => {
  const { name, propertyType, country, stars, country_rus, id } = req.query; // параметры поиска отеля
  let condition = {};

  if (name) {
    condition.name = { [Op.like]: `%${name}%` };
  }

  if (propertyType) {
    const propertyTypes = propertyType.split(",").map((item) => item.trim());
    condition.propertyType = propertyTypes;
  }

  if (country) {
    condition.country = country;
  }

  if (country_rus) {
    condition.country_rus = country_rus;
  }

  if (stars) {
    const starValues = stars.split(",").map((item) => item.trim());
    condition.stars = starValues;
  }

  if (id) {
    const ids = id.split(",").map((item) => item.trim());
    condition.id = ids;
  }

  Hotel.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Hotels.",
      });
    });
};

// Find a single Hotel with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Hotel.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Hotel with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Hotel with id=" + id,
      });
    });
};

// Update a Hotel by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Hotel.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Hotel was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Hotel with id=${id}. Maybe Hotel was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Hotel with id=" + id,
      });
    });
};

// Delete a Hotel with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Hotel.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Hotel was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Hotel with id=${id}. Maybe Hotel was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Movie with id=" + id,
      });
    });
};

// Delete all Hotels from the database.
exports.deleteAll = (req, res) => {
  Hotel.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Hotels were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Hotels.",
      });
    });
};

// Find Hotel by stars
exports.findAllByStars = (req, res) => {
  const stars = req.params.stars;

  Hotel.findAll({ where: { stars: stars } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Hotels.",
      });
    });
};
