import Subject from '../models/subject.js';

export const createSubject = async (req, res) => {
  try {
    const { name, code, semesterId, schedule, totalClassesHeld, baselineAttended } = req.body;

    const subject = new Subject({
      userId: req.user.userId,
      semesterId,
      name,
      code,
      schedule,
      totalClassesHeld: totalClassesHeld || 0,
      baselineAttended: baselineAttended || 0
    });

    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ error: 'Server error',error });
  }
};

export const getSubjects = async (req, res) => {
  try {
    const { semesterId } = req.query;
    const subjects = await Subject.find({
      userId: req.user.userId,
      ...(semesterId && { semesterId })
    });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
