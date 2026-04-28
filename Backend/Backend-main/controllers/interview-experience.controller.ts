import type { Request, Response } from "express";
import InterviewExperience from "../models/interview-experience.model.ts";
import Company from "../models/company.model.ts";

// GET /api/interview-experience?result=selected&page=1&limit=20
export const getAllExperiences = async (req: Request, res: Response) => {
  try {
    const { result, page = "1", limit = "20" } = req.query;
    const filter: Record<string, unknown> = { isApproved: true };
    if (result) filter.result = result;

    const skip = (Number(page) - 1) * Number(limit);
    const [experiences, total] = await Promise.all([
      InterviewExperience.find(filter)
        .populate("company", "name slug type color badge")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      InterviewExperience.countDocuments(filter),
    ]);

    res.json({
      experiences,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/interview-experience/company/:slug
export const getExperiencesByCompany = async (req: Request, res: Response) => {
  try {
    const company = await Company.findOne({ slug: req.params.slug });
    if (!company) return res.status(404).json({ message: "Company not found" });

    const experiences = await InterviewExperience.find({
      company: company._id,
      isApproved: true,
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(experiences);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/interview-experience/company/:slug  (authenticated)
export const submitExperience = async (req: any, res: Response) => {
  try {
    const company = await Company.findOne({ slug: req.params.slug });
    if (!company) return res.status(404).json({ message: "Company not found" });

    const { role, year, experience, result, rounds, tips } = req.body;

    if (!role || !year || !experience) {
      return res.status(400).json({ message: "role, year and experience are required" });
    }

    const doc = await InterviewExperience.create({
      company: company._id,
      author: req.user._id,
      authorName: req.user.username || "Anonymous",
      role,
      year,
      experience,
      result: result || "pending",
      rounds: rounds || [],
      tips: tips || "",
      isApproved: false,
    });

    res.status(201).json({
      message: "Experience submitted successfully. It will appear after admin approval.",
      experience: doc,
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// PATCH /api/interview-experience/:id/approve  (admin only)
export const approveExperience = async (req: Request, res: Response) => {
  try {
    const doc = await InterviewExperience.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: "Experience not found" });
    res.json(doc);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/interview-experience/:id  (admin only)
export const deleteExperience = async (req: Request, res: Response) => {
  try {
    const doc = await InterviewExperience.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: "Experience not found" });
    res.json({ message: "Experience deleted" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/interview-experience/pending  (admin only)
export const getPendingExperiences = async (_req: Request, res: Response) => {
  try {
    const experiences = await InterviewExperience.find({ isApproved: false })
      .populate("company", "name slug")
      .sort({ createdAt: -1 });
    res.json(experiences);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
