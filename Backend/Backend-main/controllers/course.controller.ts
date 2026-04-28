import type { Response } from "express";
import Course from "../models/course.model.ts";
import slugify from "slugify";

export const createCourse = async (req: any, res: Response) => {
  try {
    const { title, description, shortDescription, coverImageUrl, tags, price, category, level, whatYouWillLearn, requirements, color, icon } = req.body;

    const slug = slugify(title, { lower: true, strict: true });

    const existing = await Course.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: "Course already exists" });
    }

    const course = await Course.create({
      title,
      slug,
      description,
      shortDescription,
      coverImageUrl,
      tags,
      price,
      category,
      level,
      whatYouWillLearn,
      requirements,
      color,
      icon,
      author: req.user._id,
    });

    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: "Failed to create course" });
  }
};

export const getCourses = async (_: any, res: Response) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate(
      "author",
      "username email",
    );
    res.json(courses);
  } catch {
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

export const getCourseBySlug = async (req: any, res: Response) => {
  try {
    const course = await Course.findOne({
      slug: req.params.slug,
      isPublished: true,
    }).populate("author", "username email");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.views += 1;
    await course.save();

    res.json(course);
  } catch {
    res.status(500).json({ message: "Failed to fetch course" });
  }
};

export const updateCourse = async (req: any, res: Response) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed" });
    }

    Object.assign(course, req.body);
    await course.save();

    res.json(course);
  } catch {
    res.status(500).json({ message: "Failed to update course" });
  }
};

export const publishCourse = async (req: any, res: Response) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.isPublished = true;
    await course.save();

    res.json({ message: "Course published" });
  } catch {
    res.status(500).json({ message: "Failed to publish course" });
  }
};

export const deleteCourse = async (req: any, res: Response) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({ message: "Course deleted" });
  } catch {
    res.status(500).json({ message: "Failed to delete course" });
  }
};
