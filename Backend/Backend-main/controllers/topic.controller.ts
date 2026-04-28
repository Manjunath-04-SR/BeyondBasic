import type { Request, Response } from "express";
import Topic from "../models/topic.model.ts";
import Subtopic from "../models/subtopic.model.ts";
import Course from "../models/course.model.ts";

export const getTopicsByCourse = async (req: Request, res: Response) => {
  try {
    const { courseSlug } = req.params;
    const course = await Course.findOne({ slug: courseSlug });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const topics = await Topic.find({ course: course._id }).sort({ order: 1 });

    const topicsWithSubtopics = await Promise.all(
      topics.map(async (topic) => {
        const subtopics = await Subtopic.find({ topic: topic._id })
          .sort({ order: 1 })
          .select("-content");
        return { ...topic.toObject(), subtopics };
      }),
    );

    res.json(topicsWithSubtopics);
  } catch {
    res.status(500).json({ message: "Failed to fetch topics" });
  }
};

export const createTopic = async (req: Request, res: Response) => {
  try {
    const { title, courseId, order } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const topic = await Topic.create({ title, course: courseId, order });
    res.status(201).json(topic);
  } catch {
    res.status(500).json({ message: "Failed to create topic" });
  }
};

export const updateTopic = async (req: Request, res: Response) => {
  try {
    const topic = await Topic.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    res.json(topic);
  } catch {
    res.status(500).json({ message: "Failed to update topic" });
  }
};

export const deleteTopic = async (req: Request, res: Response) => {
  try {
    await Topic.findByIdAndDelete(req.params.id);
    await Subtopic.deleteMany({ topic: req.params.id });
    res.json({ message: "Topic deleted" });
  } catch {
    res.status(500).json({ message: "Failed to delete topic" });
  }
};
