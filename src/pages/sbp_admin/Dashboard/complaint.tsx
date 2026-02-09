import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box, Typography, Paper, Stack, Select, MenuItem, Card,
  CardContent, CardActionArea, Chip, CircularProgress, Avatar,
  Divider, InputLabel, FormControl, TextField, InputAdornment,
  Pagination, Container
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

// Icons
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import FilterListIcon from '@mui/icons-material/FilterList';

import type { RootState, AppDispatch } from "../../../store/store";
import { getAllComplaintBySbpAdminThunk } from "../../../store/features/sbp_admin/thunk/sbpAdminComplaintThunk";
import type { ComplaintType } from "../../../store/features/sbp_admin/sbp_adminComplaintSlice";
import { getBanksThunk } from "../../../store/features/bank/thunk/bankthunk";
import { sbpAdminRefreshThunk } from "../../../store/features/sbp_admin/thunk/sbp_admin.thunk";

const PRIMARY_TEAL = "#008080";
const TEAL_GRADIENT = "linear-gradient(135deg, #008080 0%, #004d4d 100%)";

const statusColor: Record<string, { bg: string, text: string, border: string }> = {
  pending: { bg: "#fff7ed", text: "#c2410c", border: "#fdba74" },
  resolved: { bg: "#f0fdf4", text: "#15803d", border: "#86efac" },
  closed: { bg: "#f1f5f9", text: "#475569", border: "#cbd5e1" },
  in_progress: { bg: "#eff6ff", text: "#1d4ed8", border: "#93c5fd" },
  escalated: { bg: "#fef2f2", text: "#b91c1c", border: "#fecaca" },
};

const ComplaintAdmin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Local state for search to avoid UI lag
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  const status = searchParams.get("status") || "";
  const bankCode = searchParams.get("bankCode") || "";
  const page = Number(searchParams.get("page") || 1);

  const { paginated, loading } = useSelector((state: RootState) => state.sbpAdminComplaints);
  const banks = useSelector((state: RootState) => state.banks.banks);

  // Sync Search with Backend (Debounced effect)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      updateFilter("search", searchTerm);
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);


  useEffect(() => {
  const fetchComplaints = async () => {
    const query = {
      page,
      limit: 10,
      status: status || undefined,
      bankCode: bankCode || undefined,
      search: searchParams.get("search") || undefined,
    };

    try {
      await dispatch(getAllComplaintBySbpAdminThunk(query)).unwrap();
    } catch (error: any) {
      // 1. Check if it's a 401 Unauthorized or expired token
      const isUnauthorized = error?.status === 401 || 
                             error?.statusCode === 401 || 
                             error?.message?.toLowerCase().includes("expired");

      if (isUnauthorized) {
        console.log("Token expired, attempting refresh...");
        try {
          // 2. Attempt to refresh the session
          await dispatch(sbpAdminRefreshThunk()).unwrap();
          
          // 3. If refresh successful, retry the original data fetch
          dispatch(getAllComplaintBySbpAdminThunk(query));
        } catch (refreshError) {
          // 4. If refresh fails, the user is truly logged out
          console.error("Session expired. Redirecting to login.");
          navigate("/admin/login");
        }
      }
    }
  };

  fetchComplaints();
}, [page, status, bankCode, searchParams.get("search"), dispatch, navigate]);

  useEffect(() => {
    if (!banks?.length) dispatch(getBanksThunk());
  }, [dispatch]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value); else params.delete(key);
    if (key !== "page") params.set("page", "1"); 
    setSearchParams(params);
  };

  const handlePageChange = (_: any, value: number) => {
    updateFilter("page", value.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", pb: 8 }}>
      {/* HEADER */}
      <Box sx={{ background: TEAL_GRADIENT, pt: 8, pb: 15, px: 3, color: "#fff", mt:4, borderRadius: "0 0 40px 40px" }}>
        <Container maxWidth="lg">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: "-0.5px" }}>
                SBP Complaints Portal
              </Typography>
              <Typography sx={{ opacity: 0.8, fontSize: "1.1rem" }}>
                Centralized monitoring for banking disputes
              </Typography>
            </Box>
            <Box sx={{ textAlign: "right", display: { xs: 'none', md: 'block' } }}>
              <Typography variant="h3" sx={{ fontWeight: 800 }}>{paginated?.totalComplaints || 0}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.6, textTransform: 'uppercase' }}>Total Records</Typography>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* FILTER & SEARCH BAR */}
      <Container maxWidth="lg" sx={{ mt: -7 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 4, border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}>
          <Stack spacing={3}>
            <Stack direction="row" spacing={1} alignItems="center">
              <FilterListIcon sx={{ color: PRIMARY_TEAL }} />
              <Typography variant="subtitle1" fontWeight={700}>Advanced Filters</Typography>
            </Stack>
            
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                fullWidth
                placeholder="Search by Complaint No or Email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>),
                }}
                sx={{ flex: 2 }}
              />

              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={status}
                  onChange={(e) => updateFilter("status", e.target.value)}
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Bank Institution</InputLabel>
                <Select
                  label="Bank Institution"
                  value={bankCode}
                  onChange={(e) => updateFilter("bankCode", e.target.value)}
                >
                  <MenuItem value="">All Banks</MenuItem>
                  {banks?.map((bank: any) => (
                    <MenuItem key={bank._id} value={bank.bankCode}>{bank.bankName}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        </Paper>

        {/* COMPLAINTS FEED */}
        {loading ? (
          <Box sx={{ textAlign: "center", py: 10 }}><CircularProgress sx={{ color: PRIMARY_TEAL }} /></Box>
        ) : (
          <Stack spacing={2.5}>
            <AnimatePresence>
              {paginated?.complaints?.map((complaint: ComplaintType, idx: number) => (
                <motion.div
                  key={complaint._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card sx={{ borderRadius: 4, border: "1px solid #eef2f6", transition: '0.3s', "&:hover": { boxShadow: "0 12px 24px rgba(0,128,128,0.08)", borderColor: PRIMARY_TEAL } }}>
                    <CardActionArea onClick={() => navigate(`/dashboard/admin/complaints/${complaint._id}`)} sx={{ p: 1 }}>
                      <CardContent>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: 'flex-start', mb: 2 }}>
                          <Box>
                            <Typography variant="caption" color="primary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                              {complaint.complaintNo}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
                              {complaint.category.replace(/_/g, " ")}
                            </Typography>
                          </Box>
                          <Chip
                            label={complaint.status.replace(/_/g, " ")}
                            sx={{
                              fontWeight: 700, fontSize: "0.75rem",
                              bgcolor: statusColor[complaint.status]?.bg || "#f8fafc",
                              color: statusColor[complaint.status]?.text || "#64748b",
                              border: `1px solid ${statusColor[complaint.status]?.border || "#e2e8f0"}`,
                            }}
                          />
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: '40px' }}>
                          {complaint.description}
                        </Typography>

                        <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />

                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
                          <Stack direction="row" spacing={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem', bgcolor: PRIMARY_TEAL }}>{complaint?.user?.name?.charAt(0)}</Avatar>
                              <Box>
                                <Typography variant="caption" color="text.disabled" display="block">CITIZEN</Typography>
                                <Typography variant="body2" fontWeight={600}>{complaint?.user?.name}</Typography>
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <AccountBalanceIcon sx={{ color: 'text.disabled' }} />
                              <Box>
                                <Typography variant="caption" color="text.disabled" display="block">BANK</Typography>
                                <Typography variant="body2" fontWeight={600}>{complaint.bank?.bankCode}</Typography>
                              </Box>
                            </Box>
                          </Stack>
                          
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <CalendarTodayIcon sx={{ fontSize: 16, color: "text.disabled" }} />
                            <Typography variant="body2" color="text.secondary">
                              {new Date(complaint.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </Typography>
                            <ArrowForwardIosIcon sx={{ fontSize: 14, ml: 1, color: PRIMARY_TEAL }} />
                          </Stack>
                        </Stack>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </Stack>
        )}

        {/* PAGINATION */}
        {!loading && paginated && paginated?.totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Pagination 
              count={paginated?.totalPages} 
              page={page} 
              onChange={handlePageChange}
              color="primary"
              size="large"
              sx={{ '& .Mui-selected': { bgcolor: PRIMARY_TEAL, color: 'white' } }}
            />
          </Box>
        )}

        {!loading && paginated?.complaints?.length === 0 && (
          <Box sx={{ textAlign: "center", py: 12 }}>
            <ErrorOutlineIcon sx={{ fontSize: 80, color: "#e2e8f0", mb: 2 }} />
            <Typography variant="h5" fontWeight={700} color="text.secondary">No results found</Typography>
            <Typography color="text.disabled">Try adjusting your filters or search terms.</Typography>
          </Box>
        )}
      </Container>

      
    </Box>


  );
};

export default ComplaintAdmin;