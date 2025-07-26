import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ManualAttendance = () => {
  const token = localStorage.getItem("token");

  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);

  const [semesterId, setSemesterId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("present");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const res = await axios.get("https://should-i-bunk-enhk.onrender.com/api/semesters", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSemesters(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch semesters", err);
        setSemesters([]);
      }
    };
    fetchSemesters();
  }, [token]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get("https://should-i-bunk-enhk.onrender.com/api/subjects", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const subjectsArray = Array.isArray(res.data)
          ? res.data
          : res.data.subjects || [];

        setSubjects(subjectsArray);
      } catch (err) {
        console.error("Failed to fetch subjects", err);
        setSubjects([]);
      }
    };
    fetchSubjects();
  }, [token]);

  useEffect(() => {
    const filtered = subjects.filter((subj) => subj.semesterId === semesterId);
    setFilteredSubjects(filtered);
    setSubjectId("");
  }, [semesterId, subjects]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://should-i-bunk-enhk.onrender.com/api/attendance",
        { subjectId, date, status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Attendance marked successfully!");
      setMessage("Attendance marked successfully!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to mark attendance.");
      setMessage("Failed to mark attendance.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-zinc-700 text-white p-8 rounded-xl">
      <h2 className="text-4xl font-bold mb-8 text-center">Mark Attendance</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 text-zinc-300">Semester</label>
          <select
            value={semesterId}
            onChange={(e) => setSemesterId(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-600 px-4 py-2 rounded outline-none"
            required
          >
            <option value="">-- Select Semester --</option>
            {semesters.map((sem) => (
              <option key={sem._id} value={sem._id}>
                {sem.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-zinc-300">Subject</label>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-600 px-4 py-2 rounded outline-none disabled:opacity-50"
            required
            disabled={!semesterId}
          >
            <option value="">-- Select Subject --</option>
            {filteredSubjects.map((subj) => (
              <option key={subj._id} value={subj._id}>
                {subj.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-zinc-300">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-600 px-4 py-2 rounded outline-none"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-zinc-300">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-600 px-4 py-2 rounded outline-none"
            required
          >
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="cancelled">Cancelled</option>
            <option value="makeup">Makeup</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-zinc-900 hover:border py-2 rounded font-medium"
        >
          Mark Attendance
        </button>
      </form>

      {message && (
        <p className="mt-6 text-center text-zinc-300">{message}</p>
      )}
    </div>
  );
};

export default ManualAttendance;
