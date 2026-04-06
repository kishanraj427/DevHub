import { exportGistController } from "@/controllers/gistController";
import { Router } from "express";

const router = Router();

router.post("/export", exportGistController);

export default router;
