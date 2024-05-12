const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const db = require("./app/models");
const xlsx = require("xlsx");

const Role = db.role;
const User = db.user;
const Hotel = db.hotels;
const Room = db.rooms;
const Order = db.orders;

// считывание данных из эксель файла
const readExcel = (file) => {
  const dbFile = xlsx.readFile(file);
  const dbWorksheet = dbFile.Sheets[dbFile.SheetNames[0]];
  const dbData = xlsx.utils.sheet_to_json(dbWorksheet);
  return dbData;
};

const hotelData = readExcel("./hotels.xlsx");
const roomData = readExcel("./room.xlsx");
const userData = readExcel("./users.xlsx");
const orderData = readExcel("./orders.xlsx");

function initial() {
  Role.create({
    id: 1,
    name: "user",
  });

  Role.create({
    id: 2,
    name: "admin",
  });

  User.create({
    username: "admin",
    email: "admin@email.com",
    password: bcrypt.hashSync("admin", 8),
  }).then((user) => {
    user.setRoles([2]);
  });

  Hotel.bulkCreate(hotelData)
    .then(() => {
      console.log("Hotel data inserted successfully.");
    })
    .catch((error) => {
      console.error("Failed to insert hotel data:", error);
    });

  Room.bulkCreate(roomData)
    .then(() => {
      console.log("Room data inserted successfully.");
    })
    .catch((error) => {
      console.error("Failed to insert room data:", error);
    });

  // Хеширование паролей перед добавлением в базу данных
  userData.forEach((user) => {
    user.password = bcrypt.hashSync(user.password, 8);
  });

  User.bulkCreate(userData)
    .then((users) => {
      console.log("User data inserted successfully.");
      users.forEach((user) => {
        user.setRoles([1]); // Установка роли для каждого пользователя в массиве
      });
    })
    .catch((error) => {
      console.error("Failed to insert user data:", error);
    });

  Order.bulkCreate(orderData)
    .then(() => {
      console.log("Order data inserted successfully.");
    })
    .catch((error) => {
      console.error("Failed to insert order data:", error);
    });
}

db.sequelize
  .sync({ force: true })
  /*для того, чтобы БД пересоздавалась, необходимо поставить .sync({ force: true})  */
  .then(() => {
    console.log("Drop and re-sync db.");
    initial(); //для отключения пересоздания БД необходимо закомментировать эту строку
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

const app = express();

var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Web-service is ON" });
});

// require routes
require("./app/routes/hotel.routes")(app);
require("./app/routes/room.routes")(app);
require("./app/routes/order.routes")(app);
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("running");
});
