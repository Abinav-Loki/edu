import { Navigate } from "react-router-dom";
import { useCampus } from "../context/CampusContext";
import { Role } from "../data/centralData";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { currentUser, activeRole } = useCampus();

  if (!currentUser) {
    return <Navigate to="/student/login" replace />;
  }

  if (!allowedRoles.includes(activeRole)) {
    // Redirect based on their role to the appropriate dashboard
    if (activeRole === "student") return <Navigate to="/" replace />;
    if (activeRole === "faculty") return <Navigate to="/faculty" replace />;
    if (activeRole === "admin") return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
