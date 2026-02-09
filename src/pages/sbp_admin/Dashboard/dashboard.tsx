// pages/dashboard/UserDashboard.tsx
import { useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { sbpAdminDashboardThunk } from "../../../store/features/sbp_admin/thunk/sbp_admin.thunk";
import type { RootState, AppDispatch } from "../../../store/store";

import DashboardCards from "../../../components/userDashboardCard.tsx/userDashboardCard";
import ComplaintCharts from "../../../components/DashboardChart";

const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { dashboard, loading, user } = useSelector(
    (state: RootState) => state.sbpAdmin,
  );

  useEffect(() => {
    if (!dashboard) {
      dispatch(sbpAdminDashboardThunk());
    }
  }, [dispatch, dashboard]);

  if (loading || !dashboard) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          minHeight: "calc(100vh - 75px)", // Header ke height ko minus karo
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#f8fafc",
          p: 2,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
<Box
  sx={{
    width: "100%",
    maxWidth: {
      xs: "100%",
      sm: "100%",
      md: "95%",
      lg: "92%",
    
    },
    mx: "auto",
    minWidth: 0,

    display: "flex",
    flexDirection: "column",
    gap: { xs: 3, md: 4 },

    bgcolor: "transparent",
    overflow: "visible",
    wordBreak: "break-word",

    mt: { xs: 1.5, md: 2,lg:2 },   // 🔥 YE LINE MASLA SOLVE KAREGI
  }}
>

  {/* Page Title - Thori si side space (px) di hai taake bilkul edge se na chipke */}
  <Typography 
    variant="h4" 
    sx={{ 
      fontWeight: 800, 
      color: "#1e293b",
      px: { xs: 1, sm: 0 }, // Mobile par halki si space, desktop par zero (Layout padding handle karega)
      fontSize: { xs: "1.8rem", md: "2.4rem" }
    }}
  >
    Dashboard
  </Typography>

  {/* Dashboard Cards Container */}
  <Box sx={{ width: "100%", minWidth: 0 }}>
<DashboardCards
      role={user?.role as "customer" | "bank_officer" | "sbp_admin"}
      data={dashboard}
    />
</Box>

  {/* Charts Section - Iski width ko ensure karein */}
  <Box
    sx={{
      width: "100%",
      minHeight: 400,
      bgcolor: "#fff",
      borderRadius: "16px", // Softer corners
      p: { xs: 2, md: 3 }, // Internal padding for chart content
      boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
      border: "1px solid #f1f5f9", // Subtle border for definition
    }}
  >
    <ComplaintCharts data={dashboard} />
  </Box>
</Box>
  );
};

export default AdminDashboard;
