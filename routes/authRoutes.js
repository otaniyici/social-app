const router = require("express").Router();

const authenticateUser = require("../middleware/auth");
const authController = require("../controllers/authController");

//REGISTER
router.post("/register", authController.register);
router.post("/login", authController.login);
router.route("/updateUser").patch(authenticateUser, authController.updateUser);

module.exports = router;
