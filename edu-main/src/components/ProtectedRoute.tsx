import { ReactNode } from "react";
import { Role } from "../data/centralData";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Role[];
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Authentication bypass: Unrestricted access for testing and evaluation
  return <>{children}</>;
}

