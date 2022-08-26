const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const BadRequestError = require("../errors/bad-request");
const NotFoundError = require("../errors/not-found");

//delete user
exports.deleteUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });

  await user.remove();
  res.status(StatusCodes.OK).json({ msg: "Success! User removed" });
};

// get user
exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new NotFoundError("user doesn't exists");
  }
  res.status(StatusCodes.OK).json({ user });
};

//follow user
exports.followUser = async (req, res) => {
  if (req.user.userId === req.params.id)
    throw new BadRequestError("you can't follow yourself!");

  const userId = req.params.id;
  const currUserId = req.user.userId;

  const user = await User.findById(userId);
  const currentUser = await User.findById(currUserId);

  if (user.followers.includes(currUserId))
    throw new BadRequestError("already following the user!");

  await user.updateOne({ $push: { followers: currUserId } });
  await currentUser.updateOne({ $push: { followings: userId } });

  res.status(StatusCodes.OK).json({ msg: "user has been followed!" });
};

//unfollow user
exports.unfollowUser = async (req, res) => {
  if (req.user.userId === req.params.id)
    throw new BadRequestError("you can't unfollow yourself!");

  const userId = req.params.id;
  const currUserId = req.user.userId;

  const user = await User.findById(userId);
  const currentUser = await User.findById(currUserId);

  if (!user.followers.includes(currUserId))
    throw new BadRequestError("not a followed user!");

  await user.updateOne({ $pull: { followers: currUserId } });
  await currentUser.updateOne({ $pull: { followings: userId } });

  res.status(StatusCodes.OK).json({ msg: "user has been unfollowed!" });
};
