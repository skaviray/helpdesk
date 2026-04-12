import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "../lib/auth-client";
import Navbar from "./Navbar";

function ProtectedRoute() {
  const { data: session, isPending } = useSession();

  if (isPending) return null;
  if (!session) return <Navigate to="/login" />;

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default ProtectedRoute;
