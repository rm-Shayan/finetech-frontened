import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect ,useState} from "react";
import type { RootState, AppDispatch } from "../../../../store/store";
import {
 sbpAdminMeThunk,
 sbpAdminRefreshThunk
} from "../../../../store/features/sbp_admin/thunk/sbp_admin.thunk";


const AdminRoute = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user, loading } = useSelector((state: RootState) => state.sbpAdmin);


  const [authChecked, setAuthChecked] = useState(false); // ✅ prevent infinite rerender

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!isAuthenticated) {
          // Refresh token first
          await dispatch(sbpAdminRefreshThunk()).unwrap();
        }
        if (!user) {
          // Fetch user data
          await dispatch(sbpAdminMeThunk()).unwrap();
        }
      } catch (err) {
        console.log("Auth failed:", err);
      } finally {
        setAuthChecked(true); // ✅ mark auth check done
      }
    };

    checkAuth();
  }, [dispatch]); // ✅ call only once

  // ✅ Loader while checking
  if (!authChecked || loading) return ;

  // ✅ Not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/admin/login?role=sbp_admin" replace state={{ from: location.pathname }} />;
  }

  // ✅ Wrong role
  if (user.role !== "sbp_admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Authorized
  return <Outlet />;
};

export default AdminRoute;
