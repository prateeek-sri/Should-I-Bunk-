import Semester from '../models/semester.js';
import extractDatesFromPDF from '../utils/pdfUtils.js'; // Assuming you have a utility function to extract dates from PDF

export const createSemester = async (req, res) => {
  try {
    const { name, startDate, endDate, workingDays } = req.body;

    const semester = new Semester({
      userId: req.user.userId,
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      workingDays
    });

    await semester.save();
    res.status(201).json(semester);
  } catch (error) {
    res.status(500).json({ error: 'Server error',error });
  }
};

export const getSemesters = async (req, res) => {
  try {
    const semesters = await Semester.find({ userId: req.user.userId });
    res.json(semesters);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const uploadHolidays = async (req, res) => {
  try {
    const { id } = req.params;
    const { manualHolidays } = req.body;
    let holidays = [];

    if (manualHolidays) {
      holidays = JSON.parse(manualHolidays).map(date => new Date(date));
    }

    if (req.file) {
      const pdf = require('pdf-parse');
      const pdfData = await pdf(req.file.buffer);
      const extractedDates = extractDatesFromPDF(pdfData.text);
      holidays = [...holidays, ...extractedDates];
    }

    const semester = await Semester.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      { holidays },
      { new: true }
    );

    res.json({ message: 'Holidays updated successfully', holidays: semester.holidays });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
