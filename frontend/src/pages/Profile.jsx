import { Outlet } from "react-router-dom";
import { SectionTitle } from "../components";

const Profile = () => {
  return (
    <div>
      <SectionTitle text={"your Profile"} />
      <Outlet />
    </div>
  );
};
export default Profile;
