import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { searchSnippets } from "../controllers/searchController";

const searchRoutes = Router();

searchRoutes.get("/snippets", authenticate, searchSnippets);

export default searchRoutes;
