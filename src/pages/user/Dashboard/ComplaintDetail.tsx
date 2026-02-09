import {
  Box,
  Typography,
  Chip,
  Paper,
  Button,
  Stack,
  CircularProgress,
  TextField,
  Container,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import {
  handleUpdate,
  handleDelete,
  handleStatusUpdate,
  isReasonRequired,
} from "../../../utils/fun";
import type { RootState, AppDispatch } from "../../../store/store";
import { getUserComplaintsByIdThunk } from "../../../store/features/user/thunk/complaint.thunk";
import { clearSelectedComplaint } from "../../../store/features/user/userComplaintSlice";
import ReasonDialog from "../../../components/reasonDialog/reasonDialog";

type UserRole = "customer" | "bank_officer" | "sbp_admin";
/* ===================== COMPLAINT DETAIL ===================== */
const ComplaintDetail = () => {
  const { complaintId } = useParams<{ complaintId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { selectedComplaint, loading } = useSelector(
    (state: RootState) => state.userComplaints,
  );
  const { user } = useSelector((state: RootState) => state.user);
  const role: UserRole = user?.role as UserRole;

  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [reasonDialog, setReasonDialog] = useState<{
    open: boolean;
    nextStatus: string | null;
  }>({
    open: false,
    nextStatus: null,
  });

  /* ======= ROLE LOGIC ======= */
  const STATUS_UPDATE_ROLES: UserRole[] = ["customer", "bank_officer"];
  const canUpdateStatus = STATUS_UPDATE_ROLES.includes(role);
  const canEditContent =
    role === "customer" && selectedComplaint?.status === "pending"; // customer can edit description/attachments
  const canCloseOrDelete =
    role === "customer" && selectedComplaint?.status === "pending";

  /* ======= STATUS + REASON LOGIC ======= */
  const onStatusClick = (nextStatus: string) => {
    if (!selectedComplaint || !canUpdateStatus) return;
    console.log("status", nextStatus);

    const needReason = isReasonRequired(
      selectedComplaint.status,
      nextStatus,
      role,
    );

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
        navigate,
      );
    }
  };

  /* ======= DIRTY CHECK ======= */
  const isDirty = useMemo(() => {
    const descriptionChanged = description !== selectedComplaint?.description;
    const filesChanged = selectedFiles.length > 0; // agar new files added
    return descriptionChanged || filesChanged;
  }, [description, selectedFiles, selectedComplaint]);

  /* ======= FETCH DATA ======= */
  useEffect(() => {
    if (complaintId) dispatch(getUserComplaintsByIdThunk(complaintId) as any);
    return () => dispatch(clearSelectedComplaint() as any);
  }, [complaintId, dispatch]);

  useEffect(() => {
    if (selectedComplaint) setDescription(selectedComplaint.description);
  }, [selectedComplaint]);

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
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              flexWrap="wrap"
            >
              <IconButton onClick={() => navigate(-1)} sx={{ color: "white" }}>
                <ArrowBackIcon />
              </IconButton>
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: "1.5rem", md: "2rem" },
                    color: "white",
                    fontWeight: 800,
                  }}
                >
                  Complaint Details
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.85)" }}>
                  Complaint ID: #{complaint.complaintNo}
                </Typography>
              </Box>
            </Stack>

            {/* Right: Action Buttons */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 1, sm: 2 }}
              mt={{ xs: 2, sm: 0 }}
              width={{ xs: "100%", sm: "auto" }}
              alignItems={{ xs: "stretch", sm: "center" }}
            >
              {/* Close Complaint Button */}
              {canCloseOrDelete && (
                <Button
                  variant="contained"
                  startIcon={<CheckCircleOutlineIcon />}
                  onClick={() => onStatusClick("closed")}
                  sx={{
                    bgcolor: "white",
                    color: "#2c7a7b",
                    fontWeight: 700,
                    width: { xs: "100%", sm: "auto" },
                    "&:hover": {
                      background: "linear-gradient(135deg, #38b2ac, #2c7a7b)",
                      color: "white",
                    },
                  }}
                >
                  Close Complaint
                </Button>
              )}

              {/* Delete Icon */}
              {canCloseOrDelete && (
                <Tooltip title="Delete">
                  <IconButton
                    onClick={() =>
                      handleDelete(complaint._id, dispatch, navigate)
                    }
                    sx={{ color: "white" }}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Tooltip>
              )}

              {/* Bank Officer: Dropdown Update Status */}
              {role === "bank_officer" && canUpdateStatus && (
                <Box width={{ xs: "100%", sm: "auto" }}>
                  <Button
                    variant="contained"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    endIcon={<ArrowDropDownIcon />}
                    sx={{
                      fontWeight: 700,
                      color: "#2c7a7b", // text teal initially
                      bgcolor: "white", // white background
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
                          onStatusClick(status); // opens reason dialog if required
                          setAnchorEl(null); // close dropdown
                        }}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              )}
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* ======= CONTENT ======= */}
      <Container maxWidth="lg" sx={{ mt: { xs: -8, md: -12 } }}>
        <Paper sx={{ borderRadius: 4, p: { xs: 3, md: 5 } }}>
          <Stack spacing={{ xs: 3, md: 4 }}>
            {/* STATUS */}
            <InfoItem
              label="Status"
              value={
                <Chip
                  label={complaint.status.toUpperCase()}
                  color={complaint.status === "pending" ? "warning" : "success"}
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "0.75rem", md: "0.875rem" },
                    py: 1,
                    px: 2,
                  }}
                />
              }
            />

            {/* DESCRIPTION */}
            <Box>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={2}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "1rem", md: "1.1rem" },
                  }}
                >
                  Issue Description
                </Typography>

                {/* EDIT BUTTON */}
                {canEditContent && !isEditing && (
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                    variant="outlined"
                  >
                    Edit
                  </Button>
                )}
              </Stack>
              {isEditing && canEditContent ? (
                <TextField
                  multiline
                  fullWidth
                  minRows={5}
                  sx={{ mt: 2 }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              ) : (
                <Typography sx={{ mt: 2, whiteSpace: "pre-line" }}>
                  {description}
                </Typography>
              )}
              {/* ATTACHMENTS */}
              <Box sx={{ mt: 3 }}>
                <Typography fontWeight={700} mb={1}>
                  Attachments
                </Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  {/* Existing attachments */}
                  {Array.isArray(complaint.attachments) &&
                  complaint.attachments.length > 0
                    ? complaint.attachments.map(
                        (att: string | { url: string }, idx: number) => {
                          const url = typeof att === "string" ? att : att.url;
                          return (
                            <Button
                              key={idx}
                              variant="outlined"
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                textTransform: "none",
                                mb: 1,
                                minWidth: { xs: "120px", md: "150px" },
                              }}
                            >
                              File {idx + 1}
                            </Button>
                          );
                        },
                      )
                    : !isEditing && (
                        <Typography>No attachments available.</Typography>
                      )}

                  {/* Upload new files (customer only, edit mode) */}
                  {canEditContent && isEditing && (
                    <>
                      <input
                        type="file"
                        ref={fileInputRef}
                        hidden
                        multiple
                        onChange={(e) => {
                          const files = e.target.files
                            ? Array.from(e.target.files)
                            : [];

                          // Filter out PDFs
                          const nonPdfFiles = files.filter(
                            (file) => file.type !== "application/pdf",
                          );
                          if (nonPdfFiles.length !== files.length) {
                            alert("PDF files are not allowed!");
                          }

                          // Max 4 files
                          if (selectedFiles.length + nonPdfFiles.length > 4) {
                            alert("Maximum 4 attachments allowed!");
                            return;
                          }

                          // Max total size 40MB
                          const totalSize =
                            nonPdfFiles.reduce(
                              (acc, file) => acc + file.size,
                              0,
                            ) +
                            selectedFiles.reduce(
                              (acc, file) => acc + file.size,
                              0,
                            );

                          if (totalSize > 40 * 1024 * 1024) {
                            alert("Total attachments size cannot exceed 40MB!");
                            return;
                          }

                          // Add valid files
                          setSelectedFiles([...selectedFiles, ...nonPdfFiles]);
                        }}
                      />

                      <Button
                        startIcon={<CloudUploadIcon />}
                        onClick={() => fileInputRef.current?.click()}
                        sx={{ mb: 1 }}
                      >
                        {selectedFiles.length > 0
                          ? `${selectedFiles.length} file(s) selected`
                          : "Add Files"}
                      </Button>

                      {/* Selected files list */}
                      <Stack spacing={1} mt={1}>
                        {selectedFiles.map((file, idx) => (
                          <Stack
                            key={idx}
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Typography>{file.name}</Typography>
                            <IconButton
                              size="small"
                              onClick={() =>
                                setSelectedFiles(
                                  selectedFiles.filter((_, i) => i !== idx),
                                )
                              }
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        ))}
                      </Stack>
                    </>
                  )}
                </Stack>
              </Box>
              {/* EDIT ACTIONS */}
              {isEditing && canEditContent && (
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="flex-end"
                  spacing={2}
                  sx={{ mt: 3 }}
                >
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedFiles([]);
                      setDescription(complaint.description);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={!isDirty}
                    onClick={() =>
                      handleUpdate(
                        dispatch,
                        complaint._id,
                        description,
                        selectedFiles, // array of files
                        setIsEditing,
                      )
                    }
                  >
                    Update
                  </Button>
                </Stack>
              )}
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

      {/* ======= REASON DIALOG (ONLY CUSTOMER/BANK_OFFICER) ======= */}
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
              navigate,
            );
            setReasonDialog({ open: false, nextStatus: null });
          }}
        />
      )}
    </Box>
  );
};

/* ======= INFO ITEM ======= */
const InfoItem = ({ label, value }: { label: string; value: any }) => (
  <Box>
    <Typography variant="caption" fontWeight={700}>
      {label}
    </Typography>
    <Box>{value}</Box>
  </Box>
);

export default ComplaintDetail;
