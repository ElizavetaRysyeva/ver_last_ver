module.exports = (app) => {
  const controller = require("../controllers/room.controller.js");
  const authJwt = require("../middleware/authJwt");
  const router = require("express").Router();

  // Create a new Room
  router.post("/", controller.create);

  // Retrieve all Rooms
  router.get("/", controller.findAll);

  // Retrieve a single Room with id
  router.get("/:id", controller.findOne);

  // Update a Room with id
  router.put("/:id", controller.update);

  // Delete Room with id
  router.delete(
      "/:id",
      [authJwt.verifyToken, authJwt.isAdmin],
      controller.delete
  );

  // Delete all Rooms
  router.delete(
      "/",
      [authJwt.verifyToken, authJwt.isAdmin],
      controller.deleteAll
  );

  // Retrieve Rooms by stars
  router.get("/hotel/:hotel_id", controller.findAllByHotels);

  app.use("/api/rooms", router);
};
