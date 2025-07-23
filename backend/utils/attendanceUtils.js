function calculateAttendanceStats(subject, attendanceRecords) {
  const presentCount = attendanceRecords.filter(r => r.status === 'present').length;
  const absentCount = attendanceRecords.filter(r => r.status === 'absent').length;
  const makeupCount = attendanceRecords.filter(r => r.status === 'makeup').length;

  const totalClassesHeld = subject.totalClassesHeld + presentCount + absentCount + makeupCount;
  const totalAttended = subject.baselineAttended + presentCount + makeupCount;
  const totalMissed = totalClassesHeld - totalAttended
  const currentPercentage = totalClassesHeld > 0
    ? (totalAttended / totalClassesHeld) * 100
    : 0;

  const requiredPercentage = 75;
  const requiredAttendance = Math.ceil(totalClassesHeld * requiredPercentage / 100);
  const safeToBunk = Math.max(0, totalAttended - requiredAttendance);

  return {
    totalClassesHeld,
    totalAttended,
    totalMissed,
    currentPercentage: parseFloat(currentPercentage.toFixed(2)),
    safeToBunk,
    canBunk: currentPercentage >= requiredPercentage && safeToBunk > 0
  };
}
export default calculateAttendanceStats;