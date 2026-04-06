import { AuthRequest } from "@/middleware/auth";
import { addGistExportJob } from "@/services/gistService";
import { Response } from "express";

export const exportGistController = async (req: AuthRequest, res: Response) => {
  try {
    const { snippetId } = req.body;
    const userId = req.userId!;
    const githubToken = req.headers.authorization?.replace("Bearer ", "");

    await addGistExportJob(snippetId, userId, githubToken!);

    res.json({ message: "Gist export started", success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to queue job", success: false });
  }
};
