module.exports = (app) => {
  const controller = require("../controllers/hotel.controller.js");
  const authJwt = require("../middleware/authJwt");
  const router = require("express").Router();

  // Create a new Hotel
  router.post("/", controller.create);

  // Retrieve all Hotels
  router.get("/", controller.findAll);

  // Retrieve Hotels by stars
  router.get("/stars/:stars", controller.findAllByStars);

  // Retrieve a single Hotel with id
  router.get("/:id", controller.findOne);

  // Update a Hotel with id
  router.put("/:id", controller.update);

  // Delete a Hotel with id
  router.delete(
      "/:id",
      [authJwt.verifyToken, authJwt.isAdmin],
      controller.delete
  );

  // Delete all Hotels
  router.delete(
      "/",
      [authJwt.verifyToken, authJwt.isAdmin],
      controller.deleteAll
  );


  app.use("/api/hotels", router);
};
