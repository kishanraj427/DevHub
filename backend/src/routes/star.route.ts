import { Router } from "express";
import { authenticate } from "../middleware/auth";
import {
  toggleStar,
  getStartForUser,
  getStarsCount,
} from "../controllers/starController";

const starRoutes = Router();

starRoutes.get("/", authenticate, getStartForUser);
starRoutes.post("/snippets/:snippetId", authenticate, toggleStar);
starRoutes.get("/snippets/:snippetId/count", authenticate, getStarsCount);

export default starRoutes;
