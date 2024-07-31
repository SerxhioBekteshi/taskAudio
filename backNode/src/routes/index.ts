import express from "express";
import taskRoutes from "./taskRoutes";

const router = express.Router();

router.use("/task", taskRoutes);

export default router;
