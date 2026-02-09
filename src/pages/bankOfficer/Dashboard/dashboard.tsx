// pages/dashboard/UserDashboard.tsx
import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  bankOfficerDashboardThunk,
  bankOfficerRefreshThunk,
} from "../../../store/features/bankOfficer/thunk/bankOfficer.thunk";
import type { RootState, AppDispatch } from "../../../store/store";

import DashboardCards from "../../../components/userDashboardCard.tsx/userDashboardCard";
import ComplaintCharts from "../../../components/DashboardChart";

const Bank_OfficerDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { dashboard, loading, user } = useSelector(
    (state: RootState) => state.bankOfficer
  );

  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (dashboard || fetching) return; // Already fetched or fetching
    setFetching(true);

    const fetchDashboard = async () => {
      try {
        await dispatch(bankOfficerDashboardThunk()).unwrap();
      } catch (error: any) {
        if (error?.statusCode === 401) {
          // Try refresh once
          try {
            await dispatch(bankOfficerRefreshThunk()).unwrap();
            await dispatch(bankOfficerDashboardThunk()).unwrap();
          } catch (err) {
            console.error("Refresh failed", err);
            navigate("/login");
          }
        } else if (error?.statusCode === 429) {
          console.warn("Too many requests, try later");
        } else {
          console.error(error);
        }
      } finally {
        setFetching(false);
      }
    };

    fetchDashboard();
  }, [dispatch, dashboard, fetching, navigate]);

  if (loading || !dashboard) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          minHeight: "calc(100vh - 75px)",
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
        maxWidth: { xs: "100%", sm: "100%", md: "95%", lg: "92%" },
        mx: "auto",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: { xs: 3, md: 4 },
        bgcolor: "transparent",
        overflow: "visible",
        wordBreak: "break-word",
        mt: { xs: 1.5, md: 2, lg: 2 },
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          color: "#1e293b",
          px: { xs: 1, sm: 0 },
          fontSize: { xs: "1.8rem", md: "2.4rem" },
        }}
      >
        Dashboard
      </Typography>

      <Box sx={{ width: "100%", minWidth: 0 }}>
        <DashboardCards
          role={user?.role as "customer" | "bank_officer" | "sbp_admin"}
          data={dashboard}
        />
      </Box>

      <Box
        sx={{
          width: "100%",
          minHeight: 400,
          bgcolor: "#fff",
          borderRadius: "16px",
          p: { xs: 2, md: 3 },
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          border: "1px solid #f1f5f9",
        }}
      >
        <ComplaintCharts data={dashboard} />
      </Box>
    </Box>
  );
};

export default Bank_OfficerDashboard;
