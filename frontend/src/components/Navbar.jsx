import { BsMoonFill, BsSunFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, toggleTheme } from "../features/dashboard/DashboardSlice";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const user = useSelector((state) => state.userState.user);
  const dispatch = useDispatch(logoutUser());

  const img = user?.profilePhoto
    ? `${import.meta.env.VITE_API_BASE_URL}/image/${user?.profilePhoto}`
    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQDKWUgyPYinvZYb-8lbLAsCPp4j_toM09lQ&s";

  const navItems = [
    { name: "Home", link: "/" },
    { name: "About", link: "About" },
    { name: "Career", link: "/Career" },
    { name: "AI Chat", link: "/ai-chat" },
    { name: "Resources", link: "/Resources" },
    ...(user ? [{ name: "Community", link: "/community" }] : []),
    ...(user ? [{ name: "Dashboard", link: "/dashboard" }] : []),
  ];

  const themes = {
    winter: "winter",
    sunset: "sunset",
  };

  // Theme toggle handler
  const handleTheme = () => {
    dispatch(toggleTheme());
  };

  // On component mount, apply the saved theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || themes.winter;
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  return (
    <div className="max-w-full ml-5 mr-5">
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
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
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              {navItems.map((item) => (
                <li key={item.name}>
                  <a href={item.link}>{item.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <a className="btn btn-ghost text-2xl">
            PATHFINDER
            <div className="stats bg-primary shadow">
              <div className="p-2 text-primary-content text-2xl">AI</div>
            </div>
          </a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <a href={item.link}>{item.name}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="navbar-end mr-10 flex gap-8">
          <label className="swap swap-rotate">
            <input type="checkbox" onChange={handleTheme} />
            <BsSunFill className="swap-on h-4 w-4" />
            <BsMoonFill className="swap-off h-4 w-4" />
          </label>
          {user && (
            <NavLink to="/Profile">
              <div className="avatar">
                <div className="w-16 rounded-full ">
                  <img src={img} />
                </div>
              </div>
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
