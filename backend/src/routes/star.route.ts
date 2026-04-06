import { Router } from "express";
import { authenticate } from "../middleware/auth";
import {
  toggleStar,
  getStartForUser,
  getStarsCount,
} from "../controllers/starController";

const starRoutes = Router();

starRoutes.get("/", authenticate, getStartForUser);
starRoutes.get("/snippets/:snippetId", authenticate, toggleStar);
starRoutes.get("/:starId/count", authenticate, getStarsCount);

export default starRoutes;
