import express  from "express";
import {
    getUser,
    getUsers,
    getUserFriends,
    addRemoveFriend,
    addFriend,
    searchUsers,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/",getUsers);
router.get("/:id", verifyToken, getUser);
router.get("/:id", getUser);
router.get("/:id/friends", verifyToken, getUserFriends);
router.get("/:id/add-friend", addFriend);
router.get("/search/:query", verifyToken, searchUsers);
/* UPDATE*/
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;