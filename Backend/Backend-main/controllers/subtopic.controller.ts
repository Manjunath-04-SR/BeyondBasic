import type { Request, Response } from "express";
import Subtopic from "../models/subtopic.model.ts";
import Topic from "../models/topic.model.ts";
import slugify from "slugify";

export const getSubtopicsByTopic = async (req: Request, res: Response) => {
  try {
    const subtopics = await Subtopic.find({ topic: req.params.topicId })
      .sort({ order: 1 })
      .select("-content");
    res.json(subtopics);
  } catch {
    res.status(500).json({ message: "Failed to fetch subtopics" });
  }
};

export const getSubtopicById = async (req: Request, res: Response) => {
  try {
    const subtopic = await Subtopic.findById(req.params.id).populate(
      "topic",
      "title course",
    );
    if (!subtopic) {
      return res.status(404).json({ message: "Subtopic not found" });
    }
    res.json(subtopic);
  } catch {
    res.status(500).json({ message: "Failed to fetch subtopic" });
  }
};

export const getSubtopicBySlug = async (req: Request, res: Response) => {
  try {
    const { topicId, slug } = req.params;
    const subtopic = await Subtopic.findOne({ topic: topicId, slug }).populate(
      "topic",
      "title course",
    );
    if (!subtopic) {
      return res.status(404).json({ message: "Subtopic not found" });
    }
    res.json(subtopic);
  } catch {
    res.status(500).json({ message: "Failed to fetch subtopic" });
  }
};

export const createSubtopic = async (req: Request, res: Response) => {
  try {
    const { title, topicId, order, isFreePreview, content, estimatedReadTime, videoUrl, summary } = req.body;

    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    const slug = slugify(title, { lower: true, strict: true });

    const subtopic = await Subtopic.create({
      title,
      slug,
      topic: topicId,
      order,
      isFreePreview: isFreePreview || false,
      content: content || [],
      estimatedReadTime: estimatedReadTime || 5,
      videoUrl: videoUrl || null,
      summary: summary || "",
    });

    res.status(201).json(subtopic);
  } catch {
    res.status(500).json({ message: "Failed to create subtopic" });
  }
};

export const updateSubtopic = async (req: Request, res: Response) => {
  try {
    const subtopic = await Subtopic.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!subtopic) {
      return res.status(404).json({ message: "Subtopic not found" });
    }
    res.json(subtopic);
  } catch {
    res.status(500).json({ message: "Failed to update subtopic" });
  }
};

export const deleteSubtopic = async (req: Request, res: Response) => {
  try {
    await Subtopic.findByIdAndDelete(req.params.id);
    res.json({ message: "Subtopic deleted" });
  } catch {
    res.status(500).json({ message: "Failed to delete subtopic" });
  }
};
