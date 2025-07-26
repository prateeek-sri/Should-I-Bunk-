import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";

const CalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");

  useEffect(() => {
    const fetchSubjects = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/subjects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubjects(res.data);
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!selectedSubject) return;

      const token = localStorage.getItem("token");
      const res1 = await axios.get(
        `/api/attendance`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const res2 = await axios.get(
        `https://should-i-bunk-enhk.onrender.com/api/attendance/stats/${selectedSubject}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAttendanceRecords(res1.data);
      setAttendanceStats(res2.data);
    };

    fetchAttendance();
  }, [selectedSubject]);

  const startOfMonth = currentMonth.startOf("month");
  const endOfMonth = currentMonth.endOf("month");
  const daysInMonth = endOfMonth.date();
  const startDay = startOfMonth.day();

  const prevMonth = () => setCurrentMonth(currentMonth.subtract(1, "month"));
  const nextMonth = () => setCurrentMonth(currentMonth.add(1, "month"));

  const getStatusForDate = (date) => {
    const filteredRecords = attendanceRecords.filter(
      (r) => r.subjectId._id === selectedSubject
    );
    const record = filteredRecords.find((r) =>
      dayjs(r.date).isSame(date, "day")
    );
    return record?.status || "";
  };

  const getColor = (status) => {
    switch (status) {
      case "present":
        return "bg-zinc-00";
      case "absent":
        return "bg-red-400";
      case "makeup":
        return "bg-blue-400";
      case "cancelled":
        return "bg-gray-400";
      default:
        return "";
    }
  };

 const renderCalendar = () => {
  const rows = [];
  let days = [];
  let dateCounter = startOfMonth.startOf("week");

  for (let i = 0; i < 6; i++) {
    days = [];
    for (let j = 0; j < 7; j++) {
      const status = getStatusForDate(dateCounter);
      const isCurrentMonth = dateCounter.month() === currentMonth.month();
      const isToday = dateCounter.isSame(dayjs(), "day");

      const dotColor = {
        present: "bg-green-400",
        absent: "bg-red-400",
        makeup: "bg-blue-400",
        cancelled: "bg-gray-400",
      }[status];

      days.push(
        <td key={j} className="p-2 text-center w-12 h-12">
          <div
            className={`flex flex-col items-center justify-center rounded-md ${
              isToday ? "border border-blue-400" : ""
            }`}
          >
            <span
              className={`${
                !isCurrentMonth ? "text-gray-500" : ""
              }`}
            >
              {dateCounter.date()}
            </span>
            {status && (
              <div className={`w-2 h-2 mt-1 rounded-full ${dotColor}`}></div>
            )}
          </div>
        </td>
      );

      dateCounter = dateCounter.add(1, "day");
    }
    rows.push(<tr key={i}>{days}</tr>);
  }

  return rows;
};


return (
  <div className="max-w-4xl mx-auto p-6 bg-zinc-700 text-white rounded-xl shadow-lg min-h-screen">
    <h1 className="text-2xl font-bold mb-6 text-center">Attendance Calendar</h1>

    <div className="mb-6 flex justify-center">
      <select
        value={selectedSubject}
        onChange={(e) => setSelectedSubject(e.target.value)}
        className="p-2 rounded-md bg-zinc-800 text-white border border-zinc-600 w-full max-w-xs"
      >
        <option value="">Select Subject</option>
        {subjects.map((subject) => (
          <option key={subject._id} value={subject._id}>
            {subject.name}
          </option>
        ))}
      </select>
    </div>

    {attendanceStats && (
      <div className="mb-6 p-4 rounded-md bg-zinc-800 text-gray-300 border border-zinc-700">
        <p>Total Classes Held: {attendanceStats.totalClassesHeld}</p>
        <p>Total Attended: {attendanceStats.totalAttended}</p>
        <p>Total Missed: {attendanceStats.totalMissed}</p>
        <p>Attendance: {attendanceStats.currentPercentage}%</p>
        <p>Safe to Bunk: {attendanceStats.safeToBunk}</p>
        <p
          className={
            attendanceStats.canBunk ? "text-green-400" : "text-red-400"
          }
        >
          {attendanceStats.canBunk ? "You can bunk" : "No bunks left"}
        </p>
      </div>
    )}

    <div className="flex justify-between bg-zinc-900 items-center">
        
      <button
        onClick={prevMonth}
        className="px-4 py-2 bg-zinc-900 hover:bg-zinc-600 rounded text-white"
      >
        ‹
      </button>
      <h2 className="text-xl font-semibold">{currentMonth.format("MMMM YYYY")}</h2>
      <button
        onClick={nextMonth}
        className="px-4 py-2 bg-zinc-900 hover:bg-zinc-600 rounded text-white"
      >
        ›
      </button>
    </div>

    <table className="w-full bg-zinc-900 table-fixed border-collapse text-sm">
      <thead>
        <tr className="text-gray-400">
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day, index) => (
            <th
              key={index}
              className={`pb-2 border-b border-dotted border-zinc-600 ${
                index === 0 ? "text-red-400" : ""
              }`}
            >
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{renderCalendar()}</tbody>
    </table>
  </div>
);

};

export default CalendarView;
