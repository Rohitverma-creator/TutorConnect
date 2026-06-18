import Interview from "../models/interviewModel.js";
import Tutor from "../models/tutorModel.js";
import { generateAIResponse } from "../services/ai.js";

export const generateInterview = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const tutor = await Tutor.findById(req.user.id);
    if (!tutor) {
      return res.json({ success: false, message: "Tutor not found" });
    }

    if (tutor.status === "approved") {
      return res.json({
        success: false,
        message: "You already passed the interview",
      });
    }

    const last24hrs = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const attempts = await Interview.find({
      tutor: req.user.id,
      startedAt: { $gte: last24hrs },
    });

    if (attempts.length >= 2) {
      return res.json({
        success: false,
        message: "You used 2 attempts. Try after 24 hours",
      });
    }

    const interviewDoc = await Interview.create({
      tutor: tutor._id,
      startedAt: new Date(),
      completed: false,
    });

    const prompt = `
Generate exactly 10 interview questions for a ${tutor.subject} tutor.
Return ONLY valid JSON array.
["Question 1","Question 2"]
`;

    const text = await generateAIResponse(prompt);

    let questions = [];

    try {
      questions = JSON.parse(text);
    } catch {
      questions = text
        .split("\n")
        .map((q) => q.replace(/^\d+[\).\s-]*/, "").trim())
        .filter((q) => q.length > 0);
    }

    questions = questions.slice(0, 10);

    res.json({
      success: true,
      questions,
      interviewId: interviewDoc._id,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const submitInterview = async (req, res) => {
  try {
    const { questions, answers, interviewId } = req.body;

    if (!req.user || !req.user.id) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const tutor = await Tutor.findById(req.user.id);
    if (!tutor) {
      return res.json({ success: false, message: "Tutor not found" });
    }

    const cleanAnswers = answers.map((ans) =>
      typeof ans === "string" && ans.startsWith("data:")
        ? "User answered via audio"
        : ans || "No answer"
    );

    //  AI Prompt
    const prompt = `
Evaluate this tutor interview:

Questions: ${JSON.stringify(questions)}
Answers: ${JSON.stringify(cleanAnswers)}

Return ONLY valid JSON:
{
  "score": number,
  "feedback": "short feedback",
  "result": "pass or fail"
}
`;

    const text = await generateAIResponse(prompt);

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : null;
    }

    if (!parsed || typeof parsed.score !== "number") {
      return res.json({ success: false, message: "Invalid AI response" });
    }

    
    const interview = await Interview.findByIdAndUpdate(
      interviewId,
      {
        questions,
        answers,
        score: parsed.score,
        feedback: parsed.feedback,
        result: parsed.result,
        completed: true,
      },
      { new: true }
    );

   
    const newStatus =
      parsed.score >= 7
        ? "approved"
        : parsed.score < 5
        ? "rejected"
        : "pending";

    const updatedTutor = await Tutor.findByIdAndUpdate(
      req.user.id,
      { status: newStatus },
      { new: true }
    );

  
    res.json({
      success: true,
      interview,
      tutor: updatedTutor,
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getMyInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ tutor: req.user.id }).sort({
      createdAt: -1,
    });

    res.json({ success: true, interviews });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
