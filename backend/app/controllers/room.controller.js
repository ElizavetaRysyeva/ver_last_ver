const db = require("../models");
const Room = db.rooms;
const Op = db.Sequelize.Op;

// Create and Save a new Room
exports.create = (req, res) => {
  // Validate request
  if (!req.body.category) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Room
  const obj = {
    hotel_id: req.body.hotel_id,
    category: req.body.category,
    category_rus: req.body.category_rus,
    description: req.body.description,
    rate_description: req.body.rate_description,
    price: req.body.price,
    max_count: req.body.max_count,
    room_img: req.body.room_img,
  };

  // Save Room in the database
  Room.create(obj)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Seat.",
      });
    });
};

// Retrieve all Rooms from the database.
exports.findAll = (req, res) => {
  if (req.query.hasOwnProperty(`category`) && !req.query.category) {
    res.status(404).send({
      message: `Cannot find Rooms with empty name.`,
    });
    return;
  }

  const { max_count, description } = req.query;
  let condition = {};

  // Максимальная вместимость
  if (max_count) {
    const maxCount = max_count.split(",").map((item) => item.trim());
    condition.max_count = maxCount;
  }

  if (description) {
    condition.description = { [Op.like]: `%${description}%` };
  }

  // if (category_rus) {
  //   condition.category_rus = { [Op.like]: `%${category_rus}%` };
  // }

  // if (category) {
  //   condition.category = { [Op.like]: `%${category}%` };
  // }

  // if (hotel_id) {
  //   condition.hotel_id = hotel_id
  //     ? { hotel_id: { [Op.like]: `%${hotel_id}%` } }
  //     : null;
  // }

  if (max_count || description) {
    Room.findAll({
      where: condition,
      attributes: [
        [db.sequelize.fn("DISTINCT", db.sequelize.col("hotel_id")), "hotel_id"],
      ], // вывод только поля hotel_id в ответе
    })
      .then((data) => {
        const hotelIds = data.map((room) => room.hotel_id);
        res.send(hotelIds);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Hotels.",
        });
      });
  } else {
    Room.findAll({ where: condition })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Hotels.",
        });
      });
  }
};

// Find a single Room with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Room.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Seat with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Seat with id=" + id,
      });
    });
};

// Update a Room by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Room.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Seat was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Seat with id=${id}. Maybe Seat was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Seat with id=" + id,
      });
    });
};

// Delete a Room with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Room.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Seat was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Seat with id=${id}. Maybe Seat was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Seat with id=" + id,
      });
    });
};

// Delete all Room from the database.
exports.deleteAll = (req, res) => {
  Room.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Seats were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all Seats.",
      });
    });
};

// Find Hotel by hotels
exports.findAllByHotels = (req, res) => {
  const hotel_id = req.params.hotel_id;

  Room.findAll({ where: { hotel_id: hotel_id } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Hotels.",
      });
    });
};
