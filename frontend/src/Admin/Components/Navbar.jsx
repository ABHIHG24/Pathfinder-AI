import { Link, useNavigate, useLocation } from "react-router-dom";
import { RiAdminFill } from "react-icons/ri";
import { MdDashboardCustomize } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { MdLibraryBooks } from "react-icons/md"; // For Create Roadmap
import { ImBooks } from "react-icons/im";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { RiRoadMapFill } from "react-icons/ri";
import { logoutUser } from "../../features/dashboard/DashboardSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation(); // Get current location

  const handleLogout = async () => {
    navigate("/"); // Navigate to home or login page
    dispatch(logoutUser()); // Uncomment if you have a logout action
  };

  // Function to add active class based on the current location
  const getActiveClass = (path) => {
    return location.pathname === path ? "bg-blue-500 text-white" : "";
  };

  return (
    <div className="navbar bg-gray-400">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex="0" role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex="0"
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52 h-screen gap-4 font-bold"
          >
            <li>
              <Link
                className={`text-2xl ${getActiveClass("/admin")}`}
                to="/admin"
              >
                <MdDashboardCustomize />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                className={getActiveClass("/admin/CreateRoadmap")}
                to="/admin/CreateRoadmap"
              >
                <RiRoadMapFill />
                Create Roadmap
              </Link>
            </li>
            <li>
              <Link
                className={getActiveClass("/admin/AddResource")}
                to="/admin/AddResource"
              >
                <ImBooks />
                Add Resource
              </Link>
            </li>
            <li>
              <Link
                className={getActiveClass("/admin/ManageUser")}
                to="/admin/ManageUser"
              >
                <FaUsers />
                Manage Users
              </Link>
            </li>
            <li>
              <Link
                className={getActiveClass("/admin/Roadmap")}
                to="/admin/Roadmap"
              >
                <FaUsers />
                Manage Roadmap
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <Link className={`btn btn-ghost text-xl ${getActiveClass("/admin")}`}>
          <RiAdminFill /> Admin Dashboard
        </Link>
      </div>
      <div className="navbar-end">
        <button className="btn btn-secondary" onClick={handleLogout}>
          LogOut
        </button>
      </div>
    </div>
  );
};

export default Navbar;
