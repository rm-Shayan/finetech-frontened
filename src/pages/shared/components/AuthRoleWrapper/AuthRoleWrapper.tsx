import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import { GlobalLoader } from "../../../../components/loader";

interface Props {
  allowedRoles?: ("customer" | "bank_officer" | "sbp_admin")[];
  redirectPath?: string; // Where to send authenticated users
}

const AuthRoleWrapper = ({ allowedRoles, redirectPath = "/dashboard" }: Props) => {
  const location = useLocation();
  const { user,isAuthenticated,loading} = useSelector(
    (state: RootState) => state.user
  );

  // 🔄 Loader while auth state settling
  if (loading) return <GlobalLoader open />;

  // 🔓 If user is authenticated → redirect to previous page / dashboard
  if (isAuthenticated && user) {
    const from = (location.state as any)?.from || redirectPath;
    return <Navigate to={from} replace />;
  }

  // ✅ If allowedRoles exists, check if **any of allowedRoles** includes the role that is restricted
  if (allowedRoles && allowedRoles.includes("sbp_admin") && !location.pathname.startsWith("/admin")) {
    // Only allow sbp_admin routes if pathname is /admin
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Allowed roles for login/signup pages
  return <Outlet />;
};

export default AuthRoleWrapper;


