const router = require("express").Router();

const authenticateUser = require("../middleware/auth");
const userController = require("../controllers/userController");

router.route("/:id").get(authenticateUser, userController.getUser);
router.route("/:id/follow").put(authenticateUser, userController.followUser);
router
  .route("/:id/unfollow")
  .put(authenticateUser, userController.unfollowUser);

router.route("/delete").delete(authenticateUser, userController.deleteUser);

module.exports = router;
