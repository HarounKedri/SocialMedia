import express from "express";
import { getFeedPosts, getUserPosts, likePost, createPost, deletePost, addComment, sharePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* CREATE */
router.post("/", verifyToken, createPost);
router.post("/:postId/share", verifyToken, sharePost); // Add share post route

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.patch("/:id/comment", verifyToken, addComment);

/* DELETE */
router.delete("/:id", verifyToken, deletePost);

export default router;
