const router = require("express").Router();
const User = require("../models/User");

//Importing controller functions
const { signup, login } = require("../controllers/userController");

//Signup (create User)
router.post("/signup", signup);

//Login
router.post("/login", login);

module.exports = router;