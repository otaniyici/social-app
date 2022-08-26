const Post = require("../models/Post");
const User = require("../models/User");

const checkPermissions = require("../utils/checkPermissions");
const { StatusCodes } = require("http-status-codes");

const NotFoundError = require("../errors/not-found");
const BadRequestError = require("../errors/bad-request");

// create a post
exports.createPost = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const newPost = await Post.create(req.body);
  res.status(StatusCodes.CREATED).json({ post: newPost });
};

// update a post
exports.updatePost = async (req, res) => {
  const postId = req.params.id;
  const { desc, img } = req.body;

  const post = await Post.findById(postId);

  if (!post) throw new NotFoundError(`No post with id :${postId}`);
  checkPermissions(req.user, post.createdBy);

  post.desc = desc;
  post.img = img;

  const updatedPost = await post.save();

  res.status(StatusCodes.OK).json({ updatedPost });
};

// delete a post
exports.deletePost = async (req, res) => {
  const { id: postId } = req.params;
  const post = await Post.findOne({ _id: postId });

  if (!post) throw new NotFoundError(`No post with id :${postId}`);

  checkPermissions(req.user, post.createdBy);
  await post.remove();

  res.status(StatusCodes.OK).json({ msg: "Success! Post removed" });
};

// like a post
exports.likePost = async (req, res) => {
  const { id: postId } = req.params;
  const post = await Post.findOne({ _id: postId });

  if (!post) throw new NotFoundError(`No post with id :${postId}`);

  if (post.likes.includes(req.user.userId)) {
    await post.updateOne({ $pull: { likes: req.user.userId } });
    return res
      .status(StatusCodes.OK)
      .json({ msg: "The post has been disliked!" });
  }

  post.likes.push(req.user.userId);
  post.save();

  res.status(StatusCodes.OK).json({ msg: "The post has been liked!" });
};

// get a post
exports.getPost = async (req, res) => {
  const { id: postId } = req.params;
  const post = await Post.findOne({ _id: postId });

  if (!post) throw new NotFoundError(`No post with id :${postId}`);
  res.status(StatusCodes.OK).json({ post });
};

// get timeline posts
exports.getTimeline = async (req, res) => {
  const currId = req.user.userId;
  const currentUser = await User.findById(currId);
  const userPosts = await Post.find({ createdBy: currId });
  const friendPosts = await Promise.all(
    currentUser.followings.map((friendId) => Post.find({ createdBy: friendId }))
  );
  res.status(StatusCodes.OK).json(userPosts.concat(...friendPosts));
};
