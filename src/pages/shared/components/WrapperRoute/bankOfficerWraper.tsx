import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect,useState } from "react";
import type { RootState, AppDispatch } from "../../../../store/store";
import {
  bankOfficerRefreshThunk,
  bankOfficerMeThunk,
} from "../../../../store/features/bankOfficer/thunk/bankOfficer.thunk";

const BankOfficerRoute = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user, loading } = useSelector((state: RootState) => state.bankOfficer);

  const [authChecked, setAuthChecked] = useState(false); // ✅ prevent infinite rerender

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!isAuthenticated) {
          // Refresh token first
          await dispatch(bankOfficerRefreshThunk()).unwrap();
        }
        if (!user) {
          // Fetch user data
          await dispatch(bankOfficerMeThunk()).unwrap();
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
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // ✅ Wrong role
  if (user.role !== "bank_officer") {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Authorized
  return <Outlet />;
};

export default BankOfficerRoute;
