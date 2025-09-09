import sharp from "sharp";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import cloudinary from "../configs/cloudinary.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;
    if (!image) {
      return res
        .status(400)
        .json({ message: "Image is required", success: false });
    }

    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId).select("-password");
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });
    return res.status(201).json({
      post,
      message: "Post created successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error adding new post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "-password" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username profilePicture" },
      });
    return res.status(200).json({
      posts,
      message: "Posts fetched successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error get all post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username profilePicture" },
      });
    return res.status(200).json({
      posts,
      message: "Posts fetched successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error get user post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const likePost = async (req, res) => {
  try {
    const mylike = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }
    //logic like
    await post.updateOne({ $addToSet: { likes: mylike } });
    await post.save();
    //implement socket notif
    const user = await User.findById(mylike).select(
      "_id username profilePicture"
    );
    const postOwnerId = post.author.toString();
    if (postOwnerId !== mylike) {
      //emit a notifi
      const notification = {
        type: "like",
        userId: mylike,
        userDetails: user,
        postId,
        message: "Your post was liked",
      };
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit("notification", notification);
    }
    return res.status(200).json({ message: "Post liked", success: true });
  } catch (error) {
    console.error("Error like post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const dislikePost = async (req, res) => {
  try {
    const mylike = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }
    await post.updateOne({ $pull: { likes: mylike } });
    await post.save();
    //implement socket notif
    const user = await User.findById(mylike).select("username profilePicture");
    const postOwnerId = post.author.toString();
    if (postOwnerId !== mylike) {
      //emit a notifi
      const notification = {
        type: "dislike",
        userId: mylike,
        userDetails: user,
        postId,
        message: "Your post was disliked",
      };
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit("notification", notification);
    }
    return res.status(200).json({ message: "Post disliked", success: true });
  } catch (error) {
    console.error("Error dislike post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const myComment = req.id;
    const { text } = req.body;
    const post = await Post.findById(postId);
    if (!text) {
      return res
        .status(400)
        .json({ message: "Comment text is required", success: false });
    }
    const comment = await Comment.create({
      text,
      author: myComment,
      post: postId,
    });
    await comment.populate({
      path: "author",
      select: "username profilePicture",
    });
    post.comments.push(comment._id);
    await post.save();
    return res.status(201).json({
      comment,
      message: "Comment added successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error add comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId }).populate(
      "author",
      "username profilePicture"
    );
    if (!comments) {
      return res.status(404).json({
        message: "No comments found for this post",
        success: false,
      });
    }
    return res.status(200).json({
      comments,
      message: "Comments fetched successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error get all of post comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }
    if (post.author.toString() !== authorId) {
      return res.status(403).json({
        message: "You are not authorized to delete this post",
        success: false,
      });
    }
    await Post.findByIdAndDelete(postId);

    let user = await User.findById(authorId);
    user.posts = user.posts.filter((Id) => Id.toString() !== postId);
    await user.save();
    return res.status(200).json({
      message: "Post deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error delete post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    let post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }
    let user = await User.findById(authorId);
    if (user.bookmarks.includes(post._id)) {
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res
        .status(200)
        .json({ message: "Post removed from bookmarks", success: true });
    } else {
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      return res
        .status(200)
        .json({ message: "Post bookmarked successfully", success: true });
    }
  } catch (error) {
    console.error("Error bookmark:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
