import type { Request, Response } from "express";
import Enrollment from "../models/enrollment.model.ts";
import Course from "../models/course.model.ts";
import Subtopic from "../models/subtopic.model.ts";
import Topic from "../models/topic.model.ts";

export const enrollInCourse = async (req: any, res: Response) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const existing = await Enrollment.findOne({ user: userId, course: courseId });
    if (existing) {
      return res.status(400).json({ message: "Already enrolled", enrollment: existing });
    }

    const firstTopic = await Topic.findOne({ course: courseId }).sort({ order: 1 });
    let firstSubtopic = null;
    if (firstTopic) {
      firstSubtopic = await Subtopic.findOne({ topic: firstTopic._id }).sort({ order: 1 });
    }

    const enrollment = await Enrollment.create({
      user: userId,
      course: courseId,
      lastAccessedSubtopic: firstSubtopic?._id || null,
      completedSubtopics: [],
      progress: 0,
    });

    await Course.findByIdAndUpdate(courseId, { $inc: { totalEnrollments: 1 } });

    res.status(201).json(enrollment);
  } catch {
    res.status(500).json({ message: "Failed to enroll" });
  }
};

export const getMyEnrollments = async (req: any, res: Response) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id }).populate(
      "course",
      "title slug coverImageUrl color icon estimatedDuration level totalEnrollments rating",
    );
    res.json(enrollments);
  } catch {
    res.status(500).json({ message: "Failed to fetch enrollments" });
  }
};

export const getEnrollmentByCourse = async (req: any, res: Response) => {
  try {
    const { courseSlug } = req.params;
    const course = await Course.findOne({ slug: courseSlug });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: course._id,
    }).populate("lastAccessedSubtopic", "title slug");

    if (!enrollment) {
      return res.status(404).json({ message: "Not enrolled" });
    }

    res.json(enrollment);
  } catch {
    res.status(500).json({ message: "Failed to fetch enrollment" });
  }
};

export const markSubtopicComplete = async (req: any, res: Response) => {
  try {
    const { courseSlug, subtopicId } = req.params;
    const userId = req.user._id;

    const course = await Course.findOne({ slug: courseSlug });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const enrollment = await Enrollment.findOne({ user: userId, course: course._id });
    if (!enrollment) {
      return res.status(404).json({ message: "Not enrolled" });
    }

    const isAlreadyCompleted = enrollment.completedSubtopics.some(
      (id) => id.toString() === subtopicId,
    );

    if (!isAlreadyCompleted) {
      enrollment.completedSubtopics.push(subtopicId as any);
    }

    enrollment.lastAccessedSubtopic = subtopicId as any;

    const topics = await Topic.find({ course: course._id });
    const topicIds = topics.map((t) => t._id);
    const totalSubtopics = await Subtopic.countDocuments({ topic: { $in: topicIds } });

    enrollment.progress = totalSubtopics > 0
      ? Math.round((enrollment.completedSubtopics.length / totalSubtopics) * 100)
      : 0;

    enrollment.isCompleted = enrollment.progress === 100;

    await enrollment.save();

    res.json({
      progress: enrollment.progress,
      completedSubtopics: enrollment.completedSubtopics,
      isCompleted: enrollment.isCompleted,
    });
  } catch {
    res.status(500).json({ message: "Failed to mark complete" });
  }
};

export const saveNote = async (req: any, res: Response) => {
  try {
    const { courseSlug } = req.params;
    const { subtopicId, content } = req.body;

    const course = await Course.findOne({ slug: courseSlug });
    if (!course) return res.status(404).json({ message: "Course not found" });

    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: course._id,
    });
    if (!enrollment) return res.status(404).json({ message: "Not enrolled" });

    enrollment.notes.push({ subtopicId, content } as any);
    await enrollment.save();

    res.json({ notes: enrollment.notes });
  } catch {
    res.status(500).json({ message: "Failed to save note" });
  }
};

export const toggleBookmark = async (req: any, res: Response) => {
  try {
    const { courseSlug, subtopicId } = req.params;

    const course = await Course.findOne({ slug: courseSlug });
    if (!course) return res.status(404).json({ message: "Course not found" });

    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: course._id,
    });
    if (!enrollment) return res.status(404).json({ message: "Not enrolled" });

    const idx = enrollment.bookmarks.findIndex(
      (id) => id.toString() === subtopicId,
    );

    if (idx > -1) {
      enrollment.bookmarks.splice(idx, 1);
    } else {
      enrollment.bookmarks.push(subtopicId as any);
    }

    await enrollment.save();
    res.json({ bookmarks: enrollment.bookmarks });
  } catch {
    res.status(500).json({ message: "Failed to toggle bookmark" });
  }
};
