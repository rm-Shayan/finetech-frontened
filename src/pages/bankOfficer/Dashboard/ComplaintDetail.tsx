import {
  Box,
  Typography,
  Chip,
  Paper,
  Button,
  Stack,
  CircularProgress,
  Container,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import {
  handleStatusUpdate,
  isReasonRequired,
} from "../../../utils/fun";
import type { RootState, AppDispatch } from "../../../store/store";
import { getBankOfficerComplaintsByIdThunk } from "../../../store/features/bankOfficer/thunk/bankOfficerComplaintThunk";
import { clearSelectedComplaint } from "../../../store/features/user/userComplaintSlice";
import ReasonDialog from "../../../components/reasonDialog/reasonDialog";

type UserRole = "bank_officer";

/* ===================== COMPLAINT DETAIL ===================== */
const  BankOfficerComplaintDetail = () => {
  const { complaintId } = useParams<{ complaintId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [reasonDialog, setReasonDialog] = useState<{
    open: boolean;
    nextStatus: string | null;
  }>({ open: false, nextStatus: null });

  const { loading,selectedComplaint } = useSelector(
    (state: RootState) => state.bankOfficerComplaints
  );
  const { user } = useSelector((state: RootState) => state.bankOfficer);
  const role: UserRole = user?.role as UserRole;

  const canUpdateStatus = role === "bank_officer";

  const onStatusClick = (nextStatus: string) => {
    if (!selectedComplaint || !canUpdateStatus) return;

    const needReason = isReasonRequired(selectedComplaint.status, nextStatus, role);

    if (needReason) {
      setReasonDialog({ open: true, nextStatus });
    } else {
      handleStatusUpdate(
        selectedComplaint._id,
        nextStatus,
        selectedComplaint.status,
        dispatch,
        "",
        role,
        navigate
      );
    }
  };

  useEffect(() => {
    if (complaintId) dispatch(getBankOfficerComplaintsByIdThunk(complaintId) as any);
    return () => dispatch(clearSelectedComplaint() as any);
  }, [complaintId, dispatch]);

  if (loading || !selectedComplaint) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const complaint = selectedComplaint;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", pb: { xs: 6, md: 8 } }}>
      {/* ======= HEADER ======= */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #38b2ac, #2c7a7b)",
          pt: { xs: 6, md: 8 },
          pb: { xs: 12, md: 20 },
          mt: { xs: 3, md: 4 },
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={{ xs: 2, sm: 0 }}
          >
            {/* Left: Back + Title */}
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
              <IconButton onClick={() => navigate(-1)} sx={{ color: "white" }}>
                <ArrowBackIcon />
              </IconButton>
              <Box>
                <Typography
                  variant="h5"
                  sx={{ fontSize: { xs: "1.5rem", md: "2rem" }, color: "white", fontWeight: 800 }}
                >
                  Complaint Details
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.85)" }}>
                  Complaint ID: #{complaint.complaintNo}
                </Typography>
              </Box>
            </Stack>

            {/* Right: Bank Officer Update Status */}
            {canUpdateStatus && (
              <Box width={{ xs: "100%", sm: "auto" }}>
                <Button
                  variant="contained"
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  endIcon={<ArrowDropDownIcon />}
                  sx={{
                    fontWeight: 700,
                    color: "#2c7a7b",
                    bgcolor: "white",
                    width: { xs: "100%", sm: "auto" },
                    "&:hover": {
                      background: "linear-gradient(135deg, #38b2ac, #2c7a7b)",
                      color: "white",
                    },
                  }}
                >
                  Update Status
                </Button>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                >
                  {["resolved", "rejected", "escalated"].map((status) => (
                    <MenuItem
                      key={status}
                      onClick={() => {
                        onStatusClick(status);
                        setAnchorEl(null);
                      }}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            )}
          </Stack>
        </Container>
      </Box>

      {/* ======= CONTENT ======= */}
      <Container maxWidth="lg" sx={{ mt: { xs: -8, md: -12 } }}>
        <Paper sx={{ borderRadius: 4, p: { xs: 3, md: 5 } }}>
          <Stack spacing={{ xs: 3, md: 4 }}>
            {/* STATUS */}
            <Box>
              <Typography fontWeight={700} sx={{ mb: 1 }}>
                Current Status
              </Typography>
              <Chip
                label={complaint.status.toUpperCase()}
                color={complaint.status === "pending" ? "warning" : "success"}
                sx={{ fontWeight: 700, fontSize: { xs: "0.75rem", md: "0.875rem" }, py: 1, px: 2 }}
              />
            </Box>

            {/* DESCRIPTION */}
            <Box>
              <Typography fontWeight={700} sx={{ mb: 1 }}>
                Issue Description
              </Typography>
              <Typography sx={{ whiteSpace: "pre-line" }}>
                {complaint.description}
              </Typography>
            </Box>

            {/* OTHER DETAILS */}
            <Stack spacing={1} mt={2}>
              {complaint.createdAt && (
                <Typography variant="body2" color="text.secondary">
                  Created At: {new Date(complaint.createdAt).toLocaleString()}
                </Typography>
              )}
              {complaint.updatedAt && (
                <Typography variant="body2" color="text.secondary">
                  Last Updated: {new Date(complaint.updatedAt).toLocaleString()}
                </Typography>
              )}
            </Stack>
          </Stack>
        </Paper>
      </Container>

      {/* ======= REASON DIALOG ======= */}
      {canUpdateStatus && (
        <ReasonDialog
          open={reasonDialog.open}
          onClose={() => setReasonDialog({ open: false, nextStatus: null })}
          onSubmit={(reason: string) => {
            if (!reasonDialog.nextStatus) return;
            handleStatusUpdate(
              complaint._id,
              reasonDialog.nextStatus,
              complaint.status,
              dispatch,
              reason,
              role,
              navigate
            );
            setReasonDialog({ open: false, nextStatus: null });
          }}
        />
      )}
    </Box>
  );
};

export default BankOfficerComplaintDetail;
