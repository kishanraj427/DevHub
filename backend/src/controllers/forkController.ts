import { AuthRequest } from "@/middleware/auth";
import { createForkService, getForkCountService } from "@/services/forkService";
import { Request, Response } from "express";

export const createFork = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const snippetId = req.params.snippetId as string;

  try {
    if (!snippetId) {
      return res
        .status(400)
        .json({ message: "Invalid snippet ID", success: false });
    }
    const newFork = await createForkService(userId, snippetId);
    res.status(201).json({
      message: "Fork created successfully",
      fork: newFork,
      success: true,
    });
  } catch (error) {
    console.error("Error creating fork:", error);
    res.status(500).json({ error: "Failed to create fork", success: false });
  }
};

export const getForkCount = async (req: Request, res: Response) => {
  const snippetId = req.params.snippetId as string;
  try {
    if (!snippetId) {
      return res
        .status(400)
        .json({ error: "Invalid snippet ID", success: false });
    }
    const count = await getForkCountService(snippetId);
    res.json({ count, success: true });
  } catch (error) {
    console.error("Error fetching fork count:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch fork count", success: false });
  }
};
