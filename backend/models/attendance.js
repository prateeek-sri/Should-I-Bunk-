import mongoose from "mongoose";
const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ['present', 'absent', 'cancelled', 'makeup'],
    required: true
  },
  createdAt: { type: Date, default: Date.now }
});


const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;