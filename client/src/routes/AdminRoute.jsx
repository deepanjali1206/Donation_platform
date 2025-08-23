import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const storedUser = JSON.parse(localStorage.getItem("circleUser"));

  if (!storedUser) {
    return <Navigate to="/login" />;
  }

  if (storedUser.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
