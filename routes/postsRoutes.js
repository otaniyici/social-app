const router = require("express").Router();

const postController = require("../controllers/postController");
const authenticateUser = require("../middleware/auth");

router.route("/").get(authenticateUser, postController.getTimeline);
router.route("/").post(authenticateUser, postController.createPost);
router.route("/:id").get(authenticateUser, postController.getPost);
router.route("/:id").put(authenticateUser, postController.updatePost);
router.route("/:id").delete(authenticateUser, postController.deletePost);
router.route("/:id/like").put(authenticateUser, postController.likePost);

module.exports = router;
