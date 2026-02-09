import {
  Box,
  Typography,
  Chip,
  Paper,
  Stack,
  CircularProgress,
  Container,
  IconButton,
  Button,
} from "@mui/material";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import type { RootState, AppDispatch } from "../../../store/store";
import { clearSelectedComplaint } from "../../../store/features/user/userComplaintSlice";
import { getSbpAdminComplaintsByIdThunk } from "../../../store/features/sbp_admin/thunk/sbpAdminComplaintThunk";
import { sbpAdminRefreshThunk } from "../../../store/features/sbp_admin/thunk/sbp_admin.thunk";

const AdminComplaintDetail = () => {
  const { complaintId } = useParams<{ complaintId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { selectedComplaint , loading } = useSelector(
    (state: RootState) => state.userComplaints
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!complaintId) return;
      try {
        await dispatch(getSbpAdminComplaintsByIdThunk(complaintId)).unwrap();
      } catch (error: any) {
        if (error?.status === 401 || error?.statusCode === 401) {
          try {
            await dispatch(sbpAdminRefreshThunk()).unwrap();
            dispatch(getSbpAdminComplaintsByIdThunk(complaintId));
          } catch (refreshError) {
            navigate("/admin/login");
          }
        }
      }
    };

    fetchData();
    return () => {
      dispatch(clearSelectedComplaint());
    };
  }, [complaintId, dispatch, navigate]);

  // Enhanced check: loading OR object is empty OR status is missing
  if (loading || !selectedComplaint ) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }
  

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", pb: 8 }}>
      <Box sx={{ background: "linear-gradient(135deg, #38b2ac, #2c7a7b)", pt: 8, pb: 15, mt: 4 }}>
        <Container maxWidth="lg">
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={() => navigate(-1)} sx={{ color: "white" }}>
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="h5" sx={{ color: "white", fontWeight: 800 }}>
                Complaint Details (Admin View)
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.85)" }}>
                Ref No: #{selectedComplaint?.complaintNo || "---"}
              </Typography>
            </Box>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -10 }}>
        <Paper sx={{ borderRadius: 4, p: { xs: 3, md: 5 }, border: "1px solid #e2e8f0" }}>
          <Stack spacing={4}>
            <Box>
              <Typography variant="caption" fontWeight={700} color="text.secondary">STATUS</Typography>
              <Box mt={1}>
                <Chip
                  label={(selectedComplaint?.status || "PENDING").toUpperCase()}
                  color={selectedComplaint?.status === "pending" ? "warning" : "success"}
                  sx={{ fontWeight: 700, px: 2 }}
                />
              </Box>
            </Box>

            <Box>
              <Typography variant="h6" fontWeight={700}>Issue Description</Typography>
              <Typography sx={{ mt: 2, whiteSpace: "pre-line", color: "#4a5568" }}>
                {selectedComplaint?.description || "No description provided."}
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" fontWeight={700} mb={2}>Attachments</Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                {selectedComplaint?.attachments && selectedComplaint.attachments.length > 0 ? (
                  selectedComplaint.attachments.map((att: any, idx: number) => (
                    <Button
                      key={idx}
                      variant="outlined"
                      href={typeof att === "string" ? att : att.url}
                      target="_blank"
                      sx={{ textTransform: "none" }}
                    >
                      View Attachment {idx + 1}
                    </Button>
                  ))
                ) : (
                  <Typography color="text.secondary">No files attached.</Typography>
                )}
              </Stack>
            </Box>

            <Stack direction="row" spacing={4} sx={{ pt: 3, borderTop: "1px solid #edf2f7" }}>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">CREATED ON</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {selectedComplaint?.createdAt ? new Date(selectedComplaint.createdAt).toLocaleString() : "N/A"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">LAST UPDATED</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {selectedComplaint?.updatedAt ? new Date(selectedComplaint.updatedAt).toLocaleString() : "N/A"}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminComplaintDetail;