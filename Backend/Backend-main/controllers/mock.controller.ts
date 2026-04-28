import type { Request, Response } from "express";
import slugify from "slugify";
import MockExam from "../models/mock-exam.model.ts";
import MockQuestion from "../models/mock-question.model.ts";
import MockAttempt from "../models/mock-attempt.model.ts";

// ── Public: GET /api/mock ─────────────────────────────────────────────────────
export const getExams = async (req: any, res: Response) => {
  try {
    const exams = await MockExam.find({ isPublished: true }).sort({ createdAt: -1 });

    // Attach attempt status for logged-in users
    let attemptMap: Record<string, any> = {};
    if (req.user) {
      const attempts = await MockAttempt.find({ user: req.user._id }).select("exam score total completedAt");
      attempts.forEach((a: any) => { attemptMap[a.exam.toString()] = a; });
    }

    res.json(
      exams.map((e: any) => ({
        ...e.toObject(),
        myAttempt: attemptMap[e._id.toString()] || null,
      })),
    );
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ── Public: GET /api/mock/:id ─────────────────────────────────────────────────
export const getExamById = async (req: any, res: Response) => {
  try {
    const exam = await MockExam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    // Questions without correctAnswer (for fairness)
    const questions = await MockQuestion.find({ exam: exam._id })
      .select("-correctAnswer -explanation")
      .sort({ section: 1, order: 1 });

    // Group by section
    const sections: Record<string, any[]> = {
      aptitude: [], communication: [], coding: [], sql: [],
    };
    questions.forEach((q: any) => sections[q.section]?.push(q));

    // Check if user already attempted
    let myAttempt = null;
    if (req.user) {
      myAttempt = await MockAttempt.findOne({ user: req.user._id, exam: exam._id }).select("score total sectionScores completedAt");
    }

    res.json({ exam, sections, myAttempt });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ── Auth: POST /api/mock/:id/submit ───────────────────────────────────────────
export const submitExam = async (req: any, res: Response) => {
  try {
    const { answers, timeTaken = 0 } = req.body;
    // answers: [{ questionId: string, selected: number }]

    if (!Array.isArray(answers)) return res.status(400).json({ message: "answers array required" });

    const exam = await MockExam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    // Check already attempted
    const existing = await MockAttempt.findOne({ user: req.user._id, exam: exam._id });
    if (existing) return res.status(400).json({ message: "You have already attempted this exam" });

    // Fetch all questions with correct answers
    const questions = await MockQuestion.find({ exam: exam._id });
    const qMap: Record<string, any> = {};
    questions.forEach((q: any) => { qMap[q._id.toString()] = q; });

    const sectionScores: Record<string, { correct: number; total: number }> = {
      aptitude:      { correct: 0, total: 0 },
      communication: { correct: 0, total: 0 },
      coding:        { correct: 0, total: 0 },
      sql:           { correct: 0, total: 0 },
    };

    let totalCorrect = 0;
    const gradedAnswers: any[] = [];

    for (const ans of answers) {
      const q = qMap[ans.questionId];
      if (!q) continue;

      const isCorrect = ans.selected === q.correctAnswer;
      if (isCorrect) {
        totalCorrect++;
        sectionScores[q.section].correct++;
      }
      sectionScores[q.section].total++;

      gradedAnswers.push({
        question: q._id,
        selected: ans.selected ?? -1,
      });
    }

    const attempt = await MockAttempt.create({
      user:     req.user._id,
      exam:     exam._id,
      answers:  gradedAnswers,
      score:    totalCorrect,
      total:    questions.length,
      sectionScores,
      timeTaken,
    });

    // Return full review (questions + correct answers + explanations)
    const review = questions.map((q: any) => {
      const userAns = answers.find((a: any) => a.questionId === q._id.toString());
      return {
        _id:           q._id,
        section:       q.section,
        question:      q.question,
        options:       q.options,
        correctAnswer: q.correctAnswer,
        explanation:   q.explanation,
        selected:      userAns?.selected ?? -1,
        isCorrect:     (userAns?.selected ?? -1) === q.correctAnswer,
      };
    });

    res.json({
      score:         totalCorrect,
      total:         questions.length,
      percentage:    Math.round((totalCorrect / questions.length) * 100),
      sectionScores,
      timeTaken,
      attemptId:     attempt._id,
      review,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ── Auth: GET /api/mock/:id/my-result ─────────────────────────────────────────
export const getMyResult = async (req: any, res: Response) => {
  try {
    const attempt = await MockAttempt.findOne({
      user: req.user._id,
      exam: req.params.id,
    });
    if (!attempt) return res.status(404).json({ message: "No attempt found" });

    const questions = await MockQuestion.find({ exam: req.params.id }).sort({ section: 1, order: 1 });
    const ansMap: Record<string, number> = {};
    (attempt.answers as any[]).forEach((a: any) => { ansMap[a.question.toString()] = a.selected; });

    const review = questions.map((q: any) => ({
      _id:           q._id,
      section:       q.section,
      question:      q.question,
      options:       q.options,
      correctAnswer: q.correctAnswer,
      explanation:   q.explanation,
      selected:      ansMap[q._id.toString()] ?? -1,
      isCorrect:     (ansMap[q._id.toString()] ?? -1) === q.correctAnswer,
    }));

    res.json({
      score:         attempt.score,
      total:         attempt.total,
      percentage:    attempt.total > 0 ? Math.round((attempt.score / attempt.total) * 100) : 0,
      sectionScores: attempt.sectionScores,
      timeTaken:     attempt.timeTaken,
      completedAt:   attempt.completedAt,
      review,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ── Admin: GET /api/mock/admin/all ────────────────────────────────────────────
export const getAllExamsAdmin = async (_req: Request, res: Response) => {
  try {
    const exams = await MockExam.find().sort({ createdAt: -1 });
    res.json(exams);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ── Admin: POST /api/mock ─────────────────────────────────────────────────────
export const createExam = async (req: Request, res: Response) => {
  try {
    const slug = slugify(req.body.title, { lower: true, strict: true });
    const existing = await MockExam.findOne({ slug });
    if (existing) return res.status(409).json({ message: "Exam with this title already exists" });
    const exam = await MockExam.create({ ...req.body, slug });
    res.status(201).json(exam);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// ── Admin: PATCH /api/mock/:id ────────────────────────────────────────────────
export const updateExam = async (req: Request, res: Response) => {
  try {
    const exam = await MockExam.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    res.json(exam);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// ── Admin: DELETE /api/mock/:id ───────────────────────────────────────────────
export const deleteExam = async (req: Request, res: Response) => {
  try {
    await MockExam.findByIdAndDelete(req.params.id);
    await MockQuestion.deleteMany({ exam: req.params.id });
    await MockAttempt.deleteMany({ exam: req.params.id });
    res.json({ message: "Exam deleted" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ── Admin: GET /api/mock/:id/questions ────────────────────────────────────────
export const getQuestionsAdmin = async (req: Request, res: Response) => {
  try {
    const questions = await MockQuestion.find({ exam: req.params.id }).sort({ section: 1, order: 1 });
    res.json(questions);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ── Admin: POST /api/mock/:id/questions ───────────────────────────────────────
export const addQuestion = async (req: Request, res: Response) => {
  try {
    const exam = await MockExam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    const q = await MockQuestion.create({ ...req.body, exam: exam._id });
    // Update denormalised count
    await MockExam.findByIdAndUpdate(exam._id, { $inc: { totalQuestions: 1 } });
    res.status(201).json(q);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// ── Admin: PATCH /api/mock/questions/:qid ────────────────────────────────────
export const updateQuestion = async (req: Request, res: Response) => {
  try {
    const q = await MockQuestion.findByIdAndUpdate(req.params.qid, req.body, { new: true, runValidators: true });
    if (!q) return res.status(404).json({ message: "Question not found" });
    res.json(q);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// ── Admin: DELETE /api/mock/questions/:qid ───────────────────────────────────
export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    const q = await MockQuestion.findByIdAndDelete(req.params.qid);
    if (!q) return res.status(404).json({ message: "Question not found" });
    await MockExam.findByIdAndUpdate((q as any).exam, { $inc: { totalQuestions: -1 } });
    res.json({ message: "Question deleted" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
