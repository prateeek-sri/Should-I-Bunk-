import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Add Semester",
      description: "Create a semester with working dates.",
      route: "/add-semester",
      color: "from-indigo-500 to-purple-500",
    },
    {
      title: "Add Subject",
      description: "Add subjects to a selected semester.",
      route: "/add-subject",
      color: "from-pink-500 to-yellow-500",
    },
    {
      title: "Calendar View",
      description: "Visualize attendance by subject and date.",
      route: "/calendar",
      color: "from-green-400 to-blue-500",
    },
    {
      title: "Mark Attendance",
      description: "Manually mark attendance for any subject.",
      route: "/mark-attendance",
      color: "from-teal-400 to-cyan-500",
    },
    {
      title: "Statistics",
      description: "Track attendance and bunking safely.",
      route: "/stats",
      color: "from-orange-500 to-red-500",
    },
    {
      title: "My Profile",
      description: "View your profile, semesters, and subjects.",
      route: "/profile",
      color: "from-sky-500 to-indigo-400",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-700 py-10 px-4 sm:px-10">
      <h1 className="text-5xl text-zinc-400 mb-10">
        Dashboard
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => navigate(card.route)}
            className={`cursor-pointer bg-zinc-800 ${card.color} text-white rounded-br-md rounded-tl-md shadow-lg p-6 transform hover:scale-[1.03] transition-all duration-300 hover:shadow-2xl`}
          >
            <h2 className="text-2xl text-zinc-200 mb-2">{card.title}</h2>
            <p className="text-zinc-500 text-opacity-90">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
