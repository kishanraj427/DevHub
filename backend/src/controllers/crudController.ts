import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import * as crudService from "../services/crudService";

const toJSON = (obj: unknown) => JSON.parse(JSON.stringify(obj));
const param = (val: string | string[]) => (Array.isArray(val) ? val[0] : val);

// GET /api/:model
export const list = async (req: AuthRequest, res: Response) => {
  const model = param(req.params.model);

  if (!crudService.isValidModel(model)) {
    res
      .status(404)
      .json({ error: `Model "${model}" not found`, success: false });
    return;
  }

  try {
    const query = req.query as any;
    const page = Math.max(1, parseInt(query.page || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || "20")));

    const [data, total] = await Promise.all([
      crudService.list(model, query),
      crudService.count(model, query),
    ]);

    res.json({
      data: toJSON(data),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch records", success: false });
  }
};

// GET /api/:model/:id
export const getById = async (req: AuthRequest, res: Response) => {
  const model = param(req.params.model);
  const id = param(req.params.id);

  if (!crudService.isValidModel(model)) {
    res.status(404).json({ error: `Model "${model}" not found` });
    return;
  }

  try {
    const record = await crudService.getById(model, id);
    if (!record) {
      res.status(404).json({ error: "Record not found" });
      return;
    }
    res.json(toJSON(record));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch record" });
  }
};

// POST /api/:model
export const create = async (req: AuthRequest, res: Response) => {
  const model = param(req.params.model);

  if (!crudService.isValidModel(model)) {
    res.status(404).json({ error: `Model "${model}" not found` });
    return;
  }

  let data = req.body;

  // Inject user ID based on model
  if (model === "snippet") data = { ...data, authorId: req.userId };
  if (model === "collection") data = { ...data, ownerId: req.userId };
  if (model === "star") data = { ...data, userId: req.userId };
  if (model === "fork") data = { ...data, userId: req.userId };
  // user model might not need it, but you could set something else

  try {
    const record = await crudService.create(model, data);
    res.status(201).json(toJSON(record));
  } catch (error) {
    res.status(500).json({ error: "Failed to create record" });
  }
};

// PUT /api/:model/:id
export const update = async (req: AuthRequest, res: Response) => {
  const model = param(req.params.model);
  const id = param(req.params.id);

  if (!crudService.isValidModel(model)) {
    res.status(404).json({ error: `Model "${model}" not found` });
    return;
  }

  try {
    const existing = await crudService.getById(model, id);
    if (!existing) {
      res.status(404).json({ error: "Record not found" });
      return;
    }

    const record = await crudService.update(model, id, req.body);
    res.json(toJSON(record));
  } catch (error) {
    res.status(500).json({ error: "Failed to update record" });
  }
};

// DELETE /api/:model/:id (soft delete)
export const remove = async (req: AuthRequest, res: Response) => {
  const model = param(req.params.model);
  const id = param(req.params.id);

  if (!crudService.isValidModel(model)) {
    res.status(404).json({ error: `Model "${model}" not found` });
    return;
  }

  try {
    const existing = await crudService.getById(model, id);
    if (!existing) {
      res.status(404).json({ error: "Record not found" });
      return;
    }

    await crudService.softDelete(model, id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete record" });
  }
};
