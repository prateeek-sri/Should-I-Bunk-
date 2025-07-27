import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function CreateSemester() {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [workingDays, setWorkingDays] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [newHoliday, setNewHoliday] = useState("");

  const days = [
    { label: "Sun", value: 0 },
    { label: "Mon", value: 1 },
    { label: "Tue", value: 2 },
    { label: "Wed", value: 3 },
    { label: "Thu", value: 4 },
    { label: "Fri", value: 5 },
    { label: "Sat", value: 6 },
  ];

  const toggleDay = (day) => {
    setWorkingDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const addHoliday = () => {
    if (!newHoliday) return;
    if (holidays.includes(newHoliday)) {
      toast.error("Date already added!");
      return;
    }
    setHolidays([...holidays, newHoliday]);
    setNewHoliday("");
  };

  const removeHoliday = (date) => {
    setHolidays(holidays.filter((d) => d !== date));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/semesters`,
        {
          name,
          startDate,
          endDate,
          workingDays,
          holidays,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Semester created successfully!");
      setName("");
      setStartDate("");
      setEndDate("");
      setWorkingDays([]);
      setHolidays([]);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Failed to create semester.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 rounded-lg mt-10 text-white">
      <h2 className="text-5xl text-center font-semibold mb-6">Create Semester</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Semester Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-zinc-800 outline-none border-zinc-700 px-4 py-2 rounded"
          required
        />

        <div className="flex gap-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-zinc-800 outline-none border-zinc-700 px-4 py-2 rounded"
            required
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full bg-zinc-800 outline-none border-zinc-700 px-4 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-center text-zinc-300 mb-1">Working Days</label>
          <div className="flex flex-wrap justify-evenly gap-2">
            {days.map((day) => (
              <button
                key={day.value}
                type="button"
                onClick={() => toggleDay(day.value)}
                className={`px-3 py-1 rounded border ${
                  workingDays.includes(day.value)
                    ? "bg-zinc-700 text-white border-white"
                    : "bg-zinc-800 text-white border-zinc-600"
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Holiday (yyyy-mm-dd)"
              value={newHoliday}
              onChange={(e) => setNewHoliday(e.target.value)}
              className="w-full bg-zinc-800 outline-none border-zinc-700 px-4 py-2 rounded"
            />
            <button
              type="button"
              onClick={addHoliday}
              className="bg-zinc-900 hover:border px-4 py-2 rounded"
            >
              Add
            </button>
          </div>

          {holidays.length > 0 && (
            <ul className="list-disc pl-5 text-sm text-zinc-300">
              {holidays.map((date) => (
                <li key={date} className="flex justify-between items-center">
                  {date}
                  <button
                    type="button"
                    onClick={() => removeHoliday(date)}
                    className="ml-2 text-xs hover:text-red-400"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-zinc-900 hover:border py-2 rounded text-white"
        >
          Create Semester
        </button>
      </form>
    </div>
  );
}
