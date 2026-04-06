import { Response } from "express";
import { AuthRequest } from "@/middleware/auth";
import { searchSnippetsService } from "@/services/searchService";

export const searchSnippets = async (req: AuthRequest, res: Response) => {
  const q = req.query.q as string;

  if (!q || q.trim() === "") {
    return res
      .status(400)
      .json({ error: "Query parameter 'q' is required", success: false });
  }

  try {
    const snippets = await searchSnippetsService(q.trim());
    res.json({ snippets, success: true });
  } catch (error) {
    console.error("Error searching snippets:", error);
    res
      .status(500)
      .json({ error: "Failed to search snippets", success: false });
  }
};
