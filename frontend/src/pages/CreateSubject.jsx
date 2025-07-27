import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function CreateSubject() {
  const [semesters, setSemesters] = useState([]);
  const [semesterId, setSemesterId] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [schedule, setSchedule] = useState([]);
  const [totalClassesHeld, setTotalClassesHeld] = useState(0);
  const [baselineAttended, setBaselineAttended] = useState(0);

  const days = [
    { label: "Sun", value: 0 },
    { label: "Mon", value: 1 },
    { label: "Tue", value: 2 },
    { label: "Wed", value: 3 },
    { label: "Thu", value: 4 },
    { label: "Fri", value: 5 },
    { label: "Sat", value: 6 },
  ];

  const toggleSchedule = (day) => {
    setSchedule((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const fetchSemesters = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5001/api/semesters", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSemesters(res.data);
    } catch (err) {
      console.log("Failed to fetch semesters", err);
    }
  };

  useEffect(() => {
    fetchSemesters();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/subjects`,
        {
          name,
          code,
          semesterId,
          schedule: schedule.map((d) => ({ day: d })),
          totalClassesHeld,
          baselineAttended,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Subject created successfully!");

      setName("");
      setCode("");
      setSemesterId("");
      setSchedule([]);
      setTotalClassesHeld(0);
      setBaselineAttended(0);
    } catch (err) {
      toast.error("Failed to create subject.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-zinc-700 text-white p-8 rounded-xl">
      <h2 className="text-4xl font-bold mb-8 text-center">Create Subject</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <select
          className="w-full bg-zinc-800 border border-zinc-600 px-4 py-2 rounded outline-none"
          value={semesterId}
          onChange={(e) => setSemesterId(e.target.value)}
          required
        >
          <option value="">Select Semester</option>
          {semesters.map((sem) => (
            <option key={sem._id} value={sem._id}>
              {sem.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Subject Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-600 px-4 py-2 rounded outline-none"
          required
        />

        <input
          type="text"
          placeholder="Subject Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-600 px-4 py-2 rounded outline-none"
          required
        />

        <div>
          <label className="block text-zinc-300 mb-2 text-center">
            Schedule (Select Days)
          </label>
          <div className="flex flex-wrap justify-center gap-2">
            {days.map((day) => (
              <button
                type="button"
                key={day.value}
                onClick={() => toggleSchedule(day.value)}
                className={`px-3 py-1 rounded border ${
                  schedule.includes(day.value)
                    ? "bg-zinc-800 border"
                    : "bg-zinc-800 border-zinc-700"
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-1 text-zinc-300">Total Classes Held</label>
          <input
            type="number"
            placeholder="Total Classes Held"
            value={totalClassesHeld}
            onChange={(e) => setTotalClassesHeld(Number(e.target.value))}
            className="w-full bg-zinc-800 border border-zinc-600 px-4 py-2 rounded outline-none"
          />
        </div>

        <div>
          <label className="block mb-1 text-zinc-300">Baseline Attended</label>
          <input
            type="number"
            placeholder="Baseline Attended Classes"
            value={baselineAttended}
            onChange={(e) => setBaselineAttended(Number(e.target.value))}
            className="w-full bg-zinc-800 border border-zinc-600 px-4 py-2 rounded outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-zinc-900 hover:border py-2 rounded font-medium"
        >
          Create Subject
        </button>
      </form>
    </div>
  );
}
