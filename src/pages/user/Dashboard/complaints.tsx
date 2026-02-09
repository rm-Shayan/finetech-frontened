import {
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
  MenuItem,
  Select,
  CircularProgress,
  Button,
  Paper,
  Stack,
} from "@mui/material";
import {
  Add as AddIcon,
  FilterList as FilterIcon,
  EventNote as DateIcon,
  ArrowForwardIos as ArrowIcon,
  SentimentDissatisfied as EmptyIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import type { RootState, AppDispatch } from "../../../store/store";
import { getUserComplaintsThunk } from "../../../store/features/user/thunk/complaint.thunk";
import { refreshTokenThunk } from "../../../store/features/user/thunk/user.thunk";
import { motion } from "framer-motion";

const TEAL_GRADIENT = "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)";
const PRIMARY_TEAL = "#0f766e";

const statusColor: Record<string, any> = {
  pending: { bg: "#fff7ed", text: "#c2410c", border: "#ffedd5" },
  in_progress: { bg: "#eff6ff", text: "#1d4ed8", border: "#dbeafe" },
  resolved: { bg: "#f0fdf4", text: "#15803d", border: "#dcfce7" },
  rejected: { bg: "#fef2f2", text: "#b91c1c", border: "#fee2e2" },
  escalated: { bg: "#faf5ff", text: "#7e22ce", border: "#f3e8ff" },
};

const ComplaintsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { complaints, loading } = useSelector(
    (state: RootState) => state.userComplaints,
  );

  console.log("complaints", complaints);

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  useEffect(() => {
    const loadData = async () => {
      // Reset page state
      setPage(1);

      const query = { page: 1, status, priority };

      try {
        // Must use await with unwrap() to trigger the catch block on failure
        await dispatch(getUserComplaintsThunk(query)).unwrap();
      } catch (error: any) {
        const isUnauthorized =
          error?.statusCode === 401 ||
          error?.message?.toLowerCase().includes("expired");

        if (isUnauthorized) {
          console.log("Token expired, attempting refresh...");
          try {
            // Attempt to refresh
            await dispatch(refreshTokenThunk()).unwrap();

            // Retry original call after successful refresh
            dispatch(getUserComplaintsThunk(query));
          } catch (refreshError) {
            console.error("Session expired. Redirecting to login.");
            navigate("/admin/login");
          }
        }
      }
    };

    loadData();
  }, [status, priority, dispatch, navigate]);

  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200 &&
        !loading &&
        complaints &&
        Array.isArray(complaints.complaints) &&
        complaints.complaints.length < (complaints.count || 0)
      ) {
        const nextPage = page + 1;
        setPage(nextPage);
        dispatch(getUserComplaintsThunk({ page: nextPage, status, priority }));
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [page, loading, complaints, status, priority, dispatch]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f8fafc",
        // Top margin for proper spacing from the navbar/header
        pt: { xs: 2, md: 4 },
      }}
    >
      {/* ================= HERO SECTION ================= */}
      <Box
        sx={{
          background: TEAL_GRADIENT,
          pt: { xs: 6, md: 8 },
          pb: { xs: 10, md: 12 },
          px: { xs: 2, md: 4 },
          mt: 2,
          color: "#fff",
          borderRadius: { xs: "0 0 24px 24px", md: "0 0 48px 48px" },
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 1100,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 3,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "1.8rem", md: "2.6rem" },
                letterSpacing: "-0.02em",
              }}
            >
              My Complaints
            </Typography>
            <Typography
              sx={{
                opacity: 0.9,
                mt: 0.5,
                fontSize: { xs: "0.9rem", md: "1rem" },
              }}
            >
              Easily track and manage your banking concerns in one place.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/dashboard/user/complaints/add")}
            sx={{
              bgcolor: "#fff",
              color: PRIMARY_TEAL,
              fontWeight: 700,
              px: { xs: 3, sm: 4 },
              py: 1.5,
              borderRadius: "12px",
              width: { xs: "100%", sm: "auto" },
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.2)",
              textTransform: "none",
              "&:hover": { bgcolor: "#f1f5f9" },
            }}
          >
            New Complaint
          </Button>
        </Box>
      </Box>

      {/* ================= MAIN CONTENT SECTION ================= */}
      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
          px: { xs: 2, sm: 3 },
          pb: 8,
          mt: { xs: -5, md: -7 }, // Overlap effect
        }}
      >
        {/* -------- FILTER BAR -------- */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 2.5 },
            mb: 4,
            borderRadius: 4,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            alignItems: { xs: "stretch", md: "center" },
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)",
            border: "1px solid #e2e8f0",
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <FilterIcon sx={{ color: "text.secondary", fontSize: 20 }} />
            <Typography
              fontWeight={700}
              color="text.secondary"
              fontSize="0.9rem"
            >
              FILTER BY:
            </Typography>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            flexGrow={1}
          >
            <Select
              fullWidth
              size="small"
              value={status}
              displayEmpty
              onChange={(e) => setStatus(e.target.value)}
              sx={{ borderRadius: 2, bgcolor: "#fff" }}
            >
              <MenuItem value="">All Statuses</MenuItem>
              {[
                "pending",
                "in_progress",
                "resolved",
                "rejected",
                "escalated",
              ].map((s) => (
                <MenuItem key={s} value={s}>
                  {s.replace("_", " ").toUpperCase()}
                </MenuItem>
              ))}
            </Select>

            <Select
              fullWidth
              size="small"
              value={priority}
              displayEmpty
              onChange={(e) => setPriority(e.target.value)}
              sx={{ borderRadius: 2, bgcolor: "#fff" }}
            >
              <MenuItem value="">Any Priority</MenuItem>
              <MenuItem value="low">Low Priority</MenuItem>
              <MenuItem value="high">High Priority</MenuItem>
              <MenuItem value="medium">Medium Priority</MenuItem>
            </Select>
          </Stack>
        </Paper>

        {/* -------- COMPLAINT CARDS LIST -------- */}
        <Stack spacing={2.5}>
          {complaints?.complaints.map((c, idx) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Card
                sx={{
                  borderRadius: 4,
                  border: "1px solid #e2e8f0",
                  transition: "0.3s",
                  "&:hover": {
                    borderColor: PRIMARY_TEAL,
                    boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                  },
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 2,
                      alignItems: { xs: "flex-start", sm: "center" },
                    }}
                  >
                    {/* Left Side */}
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, fontSize: "1.1rem" }}
                        >
                          {c.category?.replace("_", " ") || "General Complaint"}
                        </Typography>
                        <Chip
                          label={c.priority?.toUpperCase()}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: "0.65rem",
                            fontWeight: 800,
                            bgcolor:
                              c.priority === "high" ? "#fff1f2" : "#f1f5f9",
                            color:
                              c.priority === "high" ? "#e11d48" : "#475569",
                          }}
                        />
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {c.description}
                      </Typography>

                      <Stack direction="row" spacing={2} alignItems="center">
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                        >
                          <DateIcon
                            sx={{ fontSize: 16, color: "text.disabled" }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </Typography>
                        </Stack>
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: 600, color: PRIMARY_TEAL }}
                        >
                          Complaint No: {c.complaintNo}
                        </Typography>
                      </Stack>
                    </Box>

                    {/* Right Side */}
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      justifyContent={{ xs: "space-between", sm: "flex-end" }}
                      minWidth={{ sm: 180 }}
                    >
                      <Chip
                        label={c.status.replace("_", " ").toUpperCase()}
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          bgcolor: statusColor[c.status]?.bg,
                          color: statusColor[c.status]?.text,
                          border: `1px solid ${statusColor[c.status]?.border}`,
                        }}
                      />

                      {/* ✅ Remarks Button */}
                      {c.remark && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={(e) => {
                            e.stopPropagation(); // prevent card click navigation
                            navigate(
                              `/dashboard/user/complaints/${c._id}/remarks`,
                            );
                          }}
                          sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: 2,
                          }}
                        >
                          Remarks
                        </Button>
                      )}

                      <ArrowIcon
                        sx={{ fontSize: 16, color: "text.disabled" }}
                      />
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Stack>

        {/* -------- LOADING & EMPTY STATES -------- */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 6,
          }}
        >
          {loading && (
            <CircularProgress size={40} sx={{ color: PRIMARY_TEAL }} />
          )}
          {!loading && complaints?.complaints.length === 0 && (
            <Box textAlign="center" sx={{ opacity: 0.5 }}>
              <EmptyIcon sx={{ fontSize: 60, mb: 1 }} />
              <Typography variant="h6">No complaints found</Typography>
              <Typography variant="body2">
                Try adjusting your filters or add a new report.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ComplaintsPage;
