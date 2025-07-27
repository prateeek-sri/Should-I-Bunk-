import { useEffect, useState } from "react";
import axios from "axios";

export default function StatisticsPage() {
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/semesters`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSemesters(res.data);
      } catch (err) {
        console.log(err);
        setError("Failed to load semesters");
      }
    };

    fetchSemesters();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!selectedSemester) return;
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/subjects?semesterId=${selectedSemester}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSubjects(res.data);
      } catch (err) {
        console.log(err);
        setError("Failed to load subjects");
      }
    };

    fetchSubjects();
  }, [selectedSemester]);

  const fetchStats = async () => {
    if (!selectedSubject) return;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/attendance/stats/${selectedSubject}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStats(res.data);
      setError("");
    } catch (err) {
      console.log(err);
      setError("Failed to load stats");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-zinc-700  rounded-lg text-white min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center">Attendance Statistics</h2>

      <div className="mb-4">
        <label className="block mb-2 text-gray-300">Select Semester</label>
        <select
          value={selectedSemester}
          onChange={(e) => {
            setSelectedSemester(e.target.value);
            setSelectedSubject("");
            setStats(null);
          }}
          className="w-full px-4 py-2 rounded-md bg-zinc-800 border border-zinc-600 text-white focus:outline-none"
        >
          <option value="">-- Select --</option>
          {semesters.map((sem) => (
            <option key={sem._id} value={sem._id}>
              {sem.name}
            </option>
          ))}
        </select>
      </div>

      {selectedSemester && (
        <div className="mb-4">
          <label className="block mb-2 text-gray-300">Select Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              setStats(null);
            }}
            className="w-full px-4 py-2 rounded-md bg-zinc-800 border border-zinc-600 text-white focus:outline-none"
          >
            <option value="">-- Select --</option>
            {subjects.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        onClick={fetchStats}
        disabled={!selectedSubject}
        className={`px-4 py-2 rounded-md transition-colors ${
          selectedSubject
            ? "bg-zinc-900 hover:bg-zinc-900 hover:border"
            : "bg-zinc-700 cursor-not-allowed"
        } text-white font-medium`}
      >
        Get Statistics
      </button>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {stats && (
        <div className="mt-6 bg-zinc-800 p-5 rounded-md border border-zinc-700">
          <h3 className="text-lg font-semibold text-gray-200 mb-3">Statistics:</h3>
          <ul className="space-y-1 text-gray-300">
            <li>Total Classes Held: <span className="text-white">{stats.totalClassesHeld}</span></li>
            <li>Marked Present: <span className="text-white">{stats.totalAttended}</span></li>
            <li>Marked Absent: <span className="text-white">{stats.totalMissed}</span></li>
            <li>Safe to Bunk: <span className="text-white">{stats.safeToBunk}</span></li>
            <li className="font-medium">Final Attendance: <span className="text-white">{stats.finalAttendance}</span></li>
            <li className="font-medium text-green-400">
              Attendance %: {stats.currentPercentage?.toFixed(2)}%
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
