import { Router } from "express";
import { signup, login, getMe } from "../controllers/authController";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  signupInputSchema,
  loginInputSchema,
} from "@devhub/shared-schemas/schemas";

const router = Router();

router.post("/signup", validate(signupInputSchema), signup);
router.post("/login", validate(loginInputSchema), login);
router.get("/me", authenticate, getMe);

export default router;
