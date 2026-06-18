import Timetable from "../models/timeTableModel.js";
import { generateAIResponse } from "../services/ai.js";



const extractJSON = (text) => {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  } catch {
    return null;
  }
};

export const generateTimetable = async (req, res) => {
  try {
    const { subjects, days, hoursPerDay, level } = req.body;

    if (!subjects || !days || !hoursPerDay) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters",
      });
    }

    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const formattedSubjects = subjects.map((sub) => ({
      name: sub,
      priority: 1,
    }));

    const daysArray =
      typeof days === "number"
        ? Array.from({ length: days }, (_, i) => `Day ${i + 1}`)
        : days;

    const prompt = `
You are an expert daily routine planner. 
Create a COMPLETE daily timetable including study, meals, rest, and activities.

Details:
- Subjects: ${subjects.join(", ")}
- Total Days: ${days}
- Study Hours per Day: ${hoursPerDay}
- Level: ${level}

STRICT RULES:
- Start day from 7:00 AM and end by 10:00 PM
- Include: Wake up, Breakfast, Lunch, Dinner, Play/Exercise, Sleep, and Short breaks
- Study slots must total ${hoursPerDay} hours per day
- Balance all subjects and add revision slots
- Non-study slots MUST have "tutorRecommended": false

Output ONLY JSON in this format:
{
  "timetable": [
    {
      "day": "Day 1",
      "slots": [
        { "time": "7:00 - 8:00", "subject": "Wake Up", "tutorRecommended": false }
      ]
    }
  ]
}
`;

    const aiResponse = await generateAIResponse(prompt);
    const parsed = extractJSON(aiResponse);

    if (!parsed || !parsed.timetable) {
      return res.status(500).json({
        success: false,
        message: "AI Engine failed to generate valid structure",
        raw: aiResponse,
      });
    }

    const cleanedTimetable = parsed.timetable.map((day) => ({
      day: day?.day || "Day",
      slots: Array.isArray(day?.slots)
        ? day.slots.map((slot) => ({
            time: slot?.time || "TBD",
            subject: slot?.subject || "Activity",
            tutorRecommended:
              typeof slot?.tutorRecommended === "boolean"
                ? slot.tutorRecommended
                : false,
          }))
        : [],
    }));

    const newTimetable = await Timetable.findOneAndUpdate(
      { user: req.userId },
      {
        subjects: formattedSubjects,
        days: daysArray,
        hoursPerDay,
        level,
        timetable: cleanedTimetable,
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      timetable: newTimetable,
    });
  } catch (error) {
    console.error("Timetable Error:", error);

    res.status(500).json({
      success: false,
      message: "Operational Error: " + error.message,
    });
  }
};

export const getMyTimetables = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }

    const timetables = await Timetable.find({ user: userId })
      .select("-__v")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      results: timetables.length,
      data: timetables || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal System Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};