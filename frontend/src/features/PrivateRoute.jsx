import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router";

const PrivateRoute = ({ children, isAdmin }) => {
  const myUser = useSelector((state) => state.userState.user);
  let location = useLocation();
  if (!myUser) {
    return <Navigate to="/login" state={{ from: location }} />;
  }
  if (isAdmin === true && myUser.role !== "admin") {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};

export default PrivateRoute;
