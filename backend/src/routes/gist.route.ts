import { exportGistController } from "@/controllers/gistController";
import { authenticate } from "../middleware/auth";
import { Router } from "express";

const router = Router();

router.post("/export", authenticate, exportGistController);

export default router;
