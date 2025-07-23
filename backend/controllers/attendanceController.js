import Attendance from '../models/attendance.js';
import Subject from '../models/subject.js';
import authenticateToken from '../middleware/authMiddleware.js';
import calculateAttendanceStats from '../utils/attendanceUtils.js';

export const markAttendance = async (req, res) => {
  try {
    const { subjectId, date, status } = req.body;

    const attendance = await Attendance.findOneAndUpdate(
      {
        userId: req.user.userId,
        subjectId,
        date: new Date(date)
      },
      { status },
      { upsert: true, new: true }
    );

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Server error',error });
  }
};

export const getAttendance = async (req, res) => {
  try {
    const { subjectId, startDate, endDate } = req.query;

    const query = { userId: req.user.userId };
    if (subjectId) query.subjectId = subjectId;
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendance = await Attendance.find(query).populate('subjectId');
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getOverallStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get all attendance records for the user
    const records = await Attendance.find({ user: userId });

    // Group by subject
    const stats = {};

    for (const record of records) {
      const subjectId = record.subjectId.toString();
      if (!stats[subjectId]) {
        stats[subjectId] = {
          total: 0,
          present: 0,
        };
      }
      stats[subjectId].total += 1;
      if (record.status === 'present') {
        stats[subjectId].present += 1;
      }
    }

    // Get subject names and compute percentage
    const response = [];

    for (const subjectId in stats) {
      const subject = await Subject.findById(subjectId);
      const { total, present } = stats[subjectId];
      response.push({
        subjectId,
        subjectName: subject ? subject.name : 'Unknown',
        total,
        present,
        percentage: total > 0 ? ((present / total) * 100).toFixed(2) : '0.00',
      });
    }

    res.json(response);
  } catch (error) {
    console.error('Error in getOverallStats:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getStats = async (req, res) => {
  try {
    const { subjectId } = req.params;

    const subject = await Subject.findOne({
      _id: subjectId,
      userId: req.user.userId
    });

    if (!subject) return res.status(404).json({ error: 'Subject not found' });

    const attendanceRecords = await Attendance.find({
      userId: req.user.userId,
      subjectId
    });

    const stats = calculateAttendanceStats(subject, attendanceRecords);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
