import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store";

export const PrivateRoutes = ({ children, rolesPermitidos }) => {
  const token = localStorage.getItem("token");
  const usuario = useAuthStore((s) => s.usuario);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (rolesPermitidos && !rolesPermitidos.includes(usuario?.rol)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};
