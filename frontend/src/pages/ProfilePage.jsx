import { useEffect, useState } from "react";
import axios from "axios";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserAndSemesters = async () => {
      try {
        const res = await axios.get("https://should-i-bunk-enhk.onrender.com/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data[0]);

        const semesterRes = await axios.get("https://should-i-bunk-enhk.onrender.com/api/semesters", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSemesters(semesterRes.data);
      } catch (err) {
        console.log(err);
        setError("Failed to load profile or semesters");
      }
    };

    fetchUserAndSemesters();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10 bg-zinc-700 rounded-lg text-white min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-center">Profile</h2>

      {error && <p className="text-red-500 mb-6">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-800 border border-zinc-600 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-200">User Details</h3>
          {user ? (
            <ul className="space-y-2 text-gray-300">
              <li><span className="text-white font-medium">Name:</span> {user.name}</li>
              <li><span className="text-white font-medium">Email:</span> {user.email}</li>
            </ul>
          ) : (
            <p className="text-gray-400">Loading user info...</p>
          )}
        </div>

        <div className="bg-zinc-800 border border-zinc-600 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-200">Semesters</h3>
          {semesters.length > 0 ? (
            <ul className="space-y-3 text-gray-300 list-disc list-inside">
              {semesters.map((sem) => (
                <li key={sem._id}>
                  <span className="text-white font-medium">{sem.name}</span><br />
                  <span className="text-sm text-gray-400">
                    {new Date(sem.startDate).toLocaleDateString()} -{" "}
                    {new Date(sem.endDate).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No semesters available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
