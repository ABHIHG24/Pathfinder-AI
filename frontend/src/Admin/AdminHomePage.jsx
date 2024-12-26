import { Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar";

const AdminHomePage = () => {
  return (
    <div>
      <Navbar />
      <div className=" my-custom-style">
        <Outlet />
      </div>
    </div>
  );
};
export default AdminHomePage;
