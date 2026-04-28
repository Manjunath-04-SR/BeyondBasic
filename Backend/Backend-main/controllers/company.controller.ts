import type { Request, Response } from "express";
import Company from "../models/company.model.ts";
import PrepContent from "../models/prep-content.model.ts";
import PrepQuestion from "../models/prep-question.model.ts";
import slugify from "slugify";

// GET /api/company
export const getCompanies = async (_req: Request, res: Response) => {
  try {
    const companies = await Company.find({ isPublished: true }).sort({ order: 1, name: 1 });
    res.json(companies);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/company/:slug
export const getCompanyBySlug = async (req: Request, res: Response) => {
  try {
    const company = await Company.findOne({ slug: req.params.slug, isPublished: true });
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json(company);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/company/:slug/prep
export const getCompanyPrepContent = async (req: Request, res: Response) => {
  try {
    const company = await Company.findOne({ slug: req.params.slug, isPublished: true });
    if (!company) return res.status(404).json({ message: "Company not found" });

    const [prepContent, questions] = await Promise.all([
      PrepContent.find({ company: company._id, isPublished: true }).sort({ category: 1, order: 1 }),
      PrepQuestion.find({ company: company._id, isPublished: true }).sort({ category: 1, order: 1, createdAt: 1 }),
    ]);

    const groupedContent: Record<string, typeof prepContent> = {};
    for (const item of prepContent) {
      if (!groupedContent[item.category]) groupedContent[item.category] = [];
      groupedContent[item.category].push(item);
    }

    const groupedQuestions: Record<string, typeof questions> = {};
    for (const q of questions) {
      if (!groupedQuestions[q.category]) groupedQuestions[q.category] = [];
      groupedQuestions[q.category].push(q);
    }

    res.json({ company, prepContent: groupedContent, questions: groupedQuestions });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/company  (admin only)
export const createCompany = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const slug = slugify(name, { lower: true, strict: true });

    const existing = await Company.findOne({ slug });
    if (existing) return res.status(409).json({ message: "Company with this name already exists" });

    const company = await Company.create({ ...req.body, slug });
    res.status(201).json(company);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// PATCH /api/company/:id  (admin only)
export const updateCompany = async (req: Request, res: Response) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json(company);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/company/:id  (admin only)
export const deleteCompany = async (req: Request, res: Response) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });
    await PrepContent.deleteMany({ company: req.params.id });
    res.json({ message: "Company deleted" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/company/:id/prep  (admin only)
export const createPrepContent = async (req: Request, res: Response) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });

    const content = await PrepContent.create({ ...req.body, company: req.params.id });
    res.status(201).json(content);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// PATCH /api/company/prep/:contentId  (admin only)
export const updatePrepContent = async (req: Request, res: Response) => {
  try {
    const content = await PrepContent.findByIdAndUpdate(req.params.contentId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!content) return res.status(404).json({ message: "Prep content not found" });
    res.json(content);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/company/prep/:contentId  (admin only)
export const deletePrepContent = async (req: Request, res: Response) => {
  try {
    const content = await PrepContent.findByIdAndDelete(req.params.contentId);
    if (!content) return res.status(404).json({ message: "Prep content not found" });
    res.json({ message: "Prep content deleted" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ── Prep Questions ──────────────────────────────────────────────────────────

// GET /api/company/:slug/questions?category=dsa  (public)
export const getQuestions = async (req: Request, res: Response) => {
  try {
    const company = await Company.findOne({ slug: req.params.slug });
    if (!company) return res.status(404).json({ message: "Company not found" });

    const filter: Record<string, unknown> = { company: company._id, isPublished: true };
    if (req.query.category) filter.category = req.query.category;

    const questions = await PrepQuestion.find(filter).sort({ order: 1, createdAt: 1 });
    res.json(questions);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/company/:id/questions  (admin only)
export const createQuestion = async (req: Request, res: Response) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });

    const question = await PrepQuestion.create({ ...req.body, company: req.params.id });
    res.status(201).json(question);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// PATCH /api/company/questions/:qId  (admin only)
export const updateQuestion = async (req: Request, res: Response) => {
  try {
    const question = await PrepQuestion.findByIdAndUpdate(req.params.qId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!question) return res.status(404).json({ message: "Question not found" });
    res.json(question);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/company/questions/:qId  (admin only)
export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    const question = await PrepQuestion.findByIdAndDelete(req.params.qId);
    if (!question) return res.status(404).json({ message: "Question not found" });
    res.json({ message: "Question deleted" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
