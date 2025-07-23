import mongoose from 'mongoose';
const subjectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  semesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester', required: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  schedule: [{
    day: { type: Number, min: 0, max: 6 },
  }],
  totalClassesHeld: { type: Number, default: 0 },
  baselineAttended: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Subject = mongoose.model('Subject', subjectSchema);
export default Subject;