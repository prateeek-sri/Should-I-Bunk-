import mongoose from 'mongoose';
const semesterSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  workingDays: [{ type: Number, min: 0, max: 6 }],
  holidays: [{ type: Date }],
  createdAt: { type: Date, default: Date.now }
});

const Semester = mongoose.model('Semester', semesterSchema);
export default Semester;