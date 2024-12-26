import { FaUsers } from "react-icons/fa";
import { CategoryScale } from "chart.js";
import { Chart as ChartJS } from "chart.js/auto";
import { Doughnut, Line } from "react-chartjs-2";
import { useState, useEffect } from "react";
import axiosInstance from "../../utils/api/axiosInstance";

const AdminDashboard = () => {
  const [user, setUser] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: userData } = await axiosInstance.get("user/admin/users");
        const { data: roadmapData } = await axiosInstance.get("/roadmaps");
        setUser(userData.users);
        setRoadmaps(roadmapData.roadmaps);
      } catch (error) {
        setIsError(true);
        console.error("Error fetching data:", error);
      }
    };

    fetchData()
      .then(() => setIsLoading(false))
      .catch(() => {
        setIsError(true);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (isError) {
    return <h1>Error occurred while fetching data!</h1>;
  }

  const today = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 7);

  const dailyUsers = Array(7).fill(0);

  user.forEach((u) => {
    const createdDate = new Date(u.createdAt);
    const diffInDays = Math.floor(
      (today - createdDate) / (1000 * 60 * 60 * 24)
    );
    if (diffInDays >= 0 && diffInDays < 7) {
      dailyUsers[6 - diffInDays]++;
    }
  });

  const latestUsers = user.filter(
    (u) => new Date(u.createdAt) >= oneWeekAgo
  ).length;

  const lineState = {
    labels: [
      "Day - 6",
      "Day - 5",
      "Day - 4",
      "Day - 3",
      "Day - 2",
      "Day - 1",
      "Today",
    ],
    datasets: [
      {
        label: "Users Created Per Day",
        data: dailyUsers,
        backgroundColor: "rgba(75, 192, 192, 0.4)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const doughnutState = {
    labels: ["Last Week Users", "All Other Users"],
    datasets: [
      {
        backgroundColor: ["#00C853", "#D32F2F"],
        hoverBackgroundColor: ["#69F0AE", "#FF5252"],
        data: [latestUsers, user.length - latestUsers],
      },
    ],
  };

  ChartJS.register(CategoryScale);

  return (
    <div className="flex flex-col justify-center items-center gap-20 bg-gray-100 min-h-screen">
      {/* Attractive Dashboard Header */}
      <div className="w-screen h-14 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
        Admin Dashboard
      </div>

      {/* Dashboard Stats */}
      <div className="flex gap-10 justify-center items-center text-2xl mt-3">
        {/* Number of Roadmaps */}
        <div className="border-4 border-blue-500 p-4 w-auto h-auto rounded-lg bg-blue-200 shadow-md font-bold flex items-center gap-2">
          <FaUsers className="text-blue-700 text-lg" />
          Roadmaps: {roadmaps && roadmaps.length}
        </div>

        {/* Users Count */}
        <div className="border-4 border-blue-500 p-4 w-auto h-auto rounded-lg bg-blue-200 shadow-md font-bold flex items-center gap-2">
          <FaUsers className="text-blue-700 text-lg" />
          Users: {user && user.length}
        </div>
      </div>

      {/* Line Chart for User Activity */}
      <div className="flex justify-center items-center h-[400px] w-[800px] bg-white shadow-lg rounded-lg mt-10">
        <div className="h-full w-full">
          <Line data={lineState} />
        </div>
      </div>

      {/* Doughnut Chart for User Distribution */}
      <div className="flex justify-center items-center h-[400px] w-[600px] bg-white shadow-lg rounded-lg mt-10">
        <div className="h-full w-full">
          <Doughnut data={doughnutState} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
