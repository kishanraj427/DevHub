import { Request, Response } from "express";
import {
  toggleStarService,
  getStarsForUserService,
  getStarsCountService,
} from "../services/starService";
import { AuthRequest } from "@/middleware/auth";

export const toggleStar = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const snippetId = req.params.snippetId;

  try {
    const result = await toggleStarService(userId, snippetId);
    res.json({
      starred: result,
      message: result ? "Star added" : "Star removed",
      success: true,
    });
  } catch (error) {
    console.error("Error toggling star:", error);
    res.status(500).json({ error: "Internal server error", success: false });
  }
};

export const getStartForUser = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  try {
    const stars = await getStarsForUserService(userId);
    res.json({ stars, success: true });
  } catch (error) {
    console.error("Error fetching stars for user:", error);
    res.status(500).json({ error: "Internal server error", success: false });
  }
};

export const getStarsCount = async (req: Request, res: Response) => {
  try {
    const starId = req.params.starId as string;
    const count = await getStarsCountService(starId);
    res.json({ count, success: true });
  } catch (error) {
    console.error("Error fetching stars count:", error);
    res.status(500).json({ error: "Internal server error", success: false });
  }
};
