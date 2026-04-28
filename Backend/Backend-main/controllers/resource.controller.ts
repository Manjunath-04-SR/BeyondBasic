import type { Request, Response } from "express";
import Resource from "../models/resource.model.ts";
import slugify from "slugify";

// GET /api/resource?type=dsa-note&category=Arrays&difficulty=Beginner
export const getResources = async (req: Request, res: Response) => {
  try {
    const { type, category, difficulty } = req.query;
    const filter: Record<string, unknown> = { isPublished: true };
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    const resources = await Resource.find(filter)
      .select("-content")
      .sort({ order: 1, createdAt: -1 });
    res.json(resources);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/resource/:slug
export const getResourceBySlug = async (req: Request, res: Response) => {
  try {
    const resource = await Resource.findOneAndUpdate(
      { slug: req.params.slug, isPublished: true },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!resource) return res.status(404).json({ message: "Resource not found" });
    res.json(resource);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/resource (admin)
export const createResource = async (req: Request, res: Response) => {
  try {
    const slug = slugify(req.body.title, { lower: true, strict: true });
    const existing = await Resource.findOne({ slug });
    if (existing) return res.status(409).json({ message: "A resource with this title already exists" });

    const resource = await Resource.create({ ...req.body, slug });
    res.status(201).json(resource);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// PATCH /api/resource/:id (admin)
export const updateResource = async (req: Request, res: Response) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!resource) return res.status(404).json({ message: "Resource not found" });
    res.json(resource);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/resource/:id (admin)
export const deleteResource = async (req: Request, res: Response) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) return res.status(404).json({ message: "Resource not found" });
    res.json({ message: "Resource deleted" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
