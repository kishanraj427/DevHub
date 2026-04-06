import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import * as service from "../services/collectionSnippetService";

const toJSON = (obj: unknown) => JSON.parse(JSON.stringify(obj));
const param = (val: string | string[]) => (Array.isArray(val) ? val[0] : val);

// GET /api/collections/:collectionId/snippets - list snippets in collection
export const list = async (req: AuthRequest, res: Response) => {
  const collectionId = param(req.params.collectionId);
  try {
    const records = await service.getSnippetsByCollection(collectionId);
    res.json({ snippets: toJSON(records), success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch snippets", success: false });
  }
};

// POST /api/collections/:collectionId/snippets/:snippetId - add snippet to collection
export const add = async (req: AuthRequest, res: Response) => {
  const collectionId = param(req.params.collectionId);
  const snippetId = param(req.params.snippetId);

  try {
    const existing = await service.isSnippetInCollection(
      collectionId,
      snippetId,
    );
    if (existing) {
      res
        .status(409)
        .json({ error: "Snippet already in collection", success: false });
      return;
    }

    const record = await service.addSnippetToCollection(
      collectionId,
      snippetId,
    );
    res.status(201).json({ snippet: toJSON(record), success: true });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to add snippet to collection", success: false });
  }
};

// DELETE /api/collections/:collectionId/snippets/:snippetId - remove snippet from collection
export const remove = async (req: AuthRequest, res: Response) => {
  const collectionId = param(req.params.collectionId);
  const snippetId = param(req.params.snippetId);

  try {
    const existing = await service.isSnippetInCollection(
      collectionId,
      snippetId,
    );
    if (!existing) {
      res
        .status(404)
        .json({ error: "Snippet not in collection", success: false });
      return;
    }

    await service.removeSnippetFromCollection(collectionId, snippetId);
    res.json({ message: "Snippet removed from collection", success: true });
  } catch (error) {
    res.status(500).json({
      error: "Failed to remove snippet from collection",
      success: false,
    });
  }
};
