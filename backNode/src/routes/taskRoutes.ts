import express from "express";
import taskController from "../controllers/taskController";

const router = express.Router();

router.post(
  "/upload",
  taskController.upload.single("file"),
  taskController.uploadAudio
);

export default router;
