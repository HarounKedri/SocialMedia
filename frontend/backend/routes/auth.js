import express from "express";
import { login } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", (req, res, next) => {
  console.log("Request Payload:", req.body);
  next();
}, login);

export default router;
