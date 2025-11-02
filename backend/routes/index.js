import express from "express";
import authRoutes from "./authRoutes.js";
import flashtalkRoutes from "./flashtalkRoutes.js";
import likeRoutes from "./likeRoutes.js";
import saveRoutes from "./saveRoutes.js";
import userRoutes from "./userRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/flashtalks", flashtalkRoutes);
router.use("/likes", likeRoutes);
router.use("/saved", saveRoutes);
router.use("/users", userRoutes);

export default router;
