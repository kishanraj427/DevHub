import { Request, Response } from 'express';
import * as crudService from '../services/crudService';

const toJSON = (obj: unknown) => JSON.parse(JSON.stringify(obj));
const param = (val: string | string[]) => Array.isArray(val) ? val[0] : val;

// GET /api/:model
export const list = async (req: Request, res: Response) => {
  const model = param(req.params.model);

  if (!crudService.isValidModel(model)) {
    res.status(404).json({ error: `Model "${model}" not found` });
    return;
  }

  const query = req.query as any;
  const page = Math.max(1, parseInt(query.page || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20')));

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
  });
};

// GET /api/:model/:id
export const getById = async (req: Request, res: Response) => {
  const model = param(req.params.model);
  const id = param(req.params.id);

  if (!crudService.isValidModel(model)) {
    res.status(404).json({ error: `Model "${model}" not found` });
    return;
  }

  const record = await crudService.getById(model, id);
  if (!record) {
    res.status(404).json({ error: 'Record not found' });
    return;
  }

  res.json(toJSON(record));
};

// POST /api/:model
export const create = async (req: Request, res: Response) => {
  const model = param(req.params.model);

  if (!crudService.isValidModel(model)) {
    res.status(404).json({ error: `Model "${model}" not found` });
    return;
  }

  const record = await crudService.create(model, req.body);
  res.status(201).json(toJSON(record));
};

// PUT /api/:model/:id
export const update = async (req: Request, res: Response) => {
  const model = param(req.params.model);
  const id = param(req.params.id);

  if (!crudService.isValidModel(model)) {
    res.status(404).json({ error: `Model "${model}" not found` });
    return;
  }

  const existing = await crudService.getById(model, id);
  if (!existing) {
    res.status(404).json({ error: 'Record not found' });
    return;
  }

  const record = await crudService.update(model, id, req.body);
  res.json(toJSON(record));
};

// DELETE /api/:model/:id (soft delete)
export const remove = async (req: Request, res: Response) => {
  const model = param(req.params.model);
  const id = param(req.params.id);

  if (!crudService.isValidModel(model)) {
    res.status(404).json({ error: `Model "${model}" not found` });
    return;
  }

  const existing = await crudService.getById(model, id);
  if (!existing) {
    res.status(404).json({ error: 'Record not found' });
    return;
  }

  await crudService.softDelete(model, id);
  res.json({ message: 'Deleted successfully' });
};
