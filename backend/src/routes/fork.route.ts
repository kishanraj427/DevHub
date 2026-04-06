import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { createFork, getForkCount } from "../controllers/forkController";

const forkRouters = Router();

forkRouters.post("/:snippetId", authenticate, createFork);
forkRouters.get("/:snippetId/count", authenticate, getForkCount);

export default forkRouters;
