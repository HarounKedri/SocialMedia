import express from "express";
import { sendMessage, getMessages, deleteMessages, getNotifications } from "../controllers/messages.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* SEND MESSAGE */
router.post("/", verifyToken, sendMessage);

/* GET MESSAGES */
router.get("/:userId1/:userId2", verifyToken, getMessages);

/* DELETE MESSAGES */
router.delete("/:userId1/:userId2", verifyToken, deleteMessages);

/* GET NOTIFICATIONS */
router.get("/notifications/:userId", verifyToken, getNotifications);

export default router;
