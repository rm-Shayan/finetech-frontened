import { useState } from "react";
import {
  Container,
  Typography,
  Stack,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Box,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteIcon from "@mui/icons-material/Delete";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../../../store/store";

import {
  logoutThunk,
  deleteAccountThunk,
  refreshTokenThunk,
} from "../../../../store/features/user/thunk/user.thunk";
import {
  sbpAdminLogoutThunk,
  sbpAdminRefreshThunk,
} from "../../../../store/features/sbp_admin/thunk/sbp_admin.thunk";
import {
  bankOfficerLogoutThunk,
  bankOfficerRefreshThunk,
} from "../../../../store/features/bankOfficer/thunk/bankOfficer.thunk";

const SettingPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const user =
    useSelector((state: RootState) => state.user.user) ||
    useSelector((state: RootState) => state.bankOfficer.user) ||
    useSelector((state: RootState) => state.sbpAdmin.user);

  const role = user?.role;

  const [profileOpen, setProfileOpen] = useState(false);

  const handleBackClick = () => navigate(-1);

  const handleLogout = async () => {
    try {
      if (role === "customer") {
        await dispatch(logoutThunk()).unwrap();
      } else if (role === "bank_officer") {
        await dispatch(bankOfficerLogoutThunk()).unwrap();
      } else if (role === "sbp_admin") {
        await dispatch(sbpAdminLogoutThunk()).unwrap();
        navigate("/admin/login");
      }
    } catch (err: any) {
      if (err?.statusCode === 401) {
        try {
          if (role === "customer") await dispatch(refreshTokenThunk()).unwrap();
          else if (role === "bank_officer")
            await dispatch(bankOfficerRefreshThunk()).unwrap();
          else if (role === "sbp_admin")
            await dispatch(sbpAdminRefreshThunk()).unwrap();
          handleLogout();
        } catch {
          navigate("/login");
        }
      }
    }
  };

  const handleDeleteAccount = () => {
    if (role === "customer") {
      dispatch(deleteAccountThunk());
      navigate("/signup");
    }
  };

  const handleViewProfile = () => {
    if (user?.role === "customer") navigate("/dashboard/user/profile/view");

    if (user?.role === "bank_officer") navigate("/dashboard/bank/profile/view");

    if (user?.role === "sbp_admin") navigate("/dashboard/admin/profile/view");
  };

  const handleUpdateProfile = () => {
    if (user?.role === "customer") navigate("/dashboard/user/profile/update");

    if (user?.role === "bank_officer")
      navigate("/dashboard/bank/profile/update");

    if (user?.role === "sbp_admin") navigate("/dashboard/admin/profile/update");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc", // very light teal-ish white
        py: 6,
        px: 2,
      }}
    >
      <Container maxWidth="lg">
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBackClick}
          sx={{
            mt: 6,
            mb: 3,
            color: "#00796b",
            textTransform: "none",
            fontSize: "1rem", // slightly smaller
            fontWeight: 600,
            py: 1.2, // reduced padding
          }}
        >
          Back
        </Button>

        {/* Page Title */}
        <Typography
          variant="h4" // reduced from h3
          fontWeight={700}
          mb={4}
          color="#000"
          textAlign="left"
        >
          Settings
        </Typography>

        <Stack spacing={2.5}>
          {" "}
          {/* slightly smaller spacing */}
          {/* Profile List */}
          <List
            sx={{
              bgcolor: "#ffffff",
              borderRadius: 1,
              color: "#000",
              width: "100%",
            }}
          >
            <ListItemButton
              onClick={() => setProfileOpen(!profileOpen)}
              sx={{ py: 2 }} // reduced height
            >
              <ListItemIcon sx={{ color: "#00796b", minWidth: 45 }}>
                <AccountCircleIcon sx={{ fontSize: 28 }} /> {/* smaller icon */}
              </ListItemIcon>
              <ListItemText
                primary="Profile"
                primaryTypographyProps={{ fontSize: "1.1rem", fontWeight: 700 }}
              />
            </ListItemButton>

            {profileOpen && (
              <>
                <ListItemButton
                  sx={{ pl: 7, py: 1.8 }}
                  onClick={handleViewProfile}
                >
                  <ListItemIcon sx={{ color: "#00796b", minWidth: 45 }}>
                    <VisibilityIcon sx={{ fontSize: 24 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="View Profile"
                    primaryTypographyProps={{
                      fontSize: "1rem",
                      fontWeight: 600,
                    }}
                  />
                </ListItemButton>

                {/* Show Update Profile only if role is NOT sbp_admin */}
                {role !== "sbp_admin" && (
                  <ListItemButton
                    sx={{ pl: 7, py: 1.8 }}
                    onClick={handleUpdateProfile}
                  >
                    <ListItemIcon sx={{ color: "#00796b", minWidth: 45 }}>
                      <EditIcon sx={{ fontSize: 24 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Update Profile"
                      primaryTypographyProps={{
                        fontSize: "1rem",
                        fontWeight: 600,
                      }}
                    />
                  </ListItemButton>
                )}
              </>
            )}
          </List>
          {/* Logout */}
          <Button
            startIcon={<LogoutIcon />}
            fullWidth
            variant="contained"
            onClick={handleLogout}
            sx={{
              bgcolor: "#00796b",
              "&:hover": { bgcolor: "#004d40" },
              textTransform: "none",
              color: "#fff",
              fontSize: "1rem", // slightly smaller
              fontWeight: 600,
              py: 1.5, // reduced
            }}
          >
            Logout
          </Button>
          {/* Delete Account */}
          {role === "customer" && (
            <Button
              startIcon={<DeleteIcon />}
              fullWidth
              variant="contained"
              onClick={handleDeleteAccount}
              sx={{
                bgcolor: "#e53935",
                "&:hover": { bgcolor: "#b71c1c" },
                textTransform: "none",
                color: "#fff",
                fontSize: "1rem",
                fontWeight: 600,
                py: 1.5,
              }}
            >
              Delete Account
            </Button>
          )}
          {/* Help & Support */}
          <Button
            startIcon={<HelpOutlineIcon />}
            fullWidth
            href="mailto:raomuhammadhsyan897@gmail.com"
            variant="outlined"
            sx={{
              justifyContent: "flex-start",
              color: "#000",
              borderColor: "#00796b",
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 600,
              py: 1.5,
            }}
          >
            Help & Support
          </Button>
        </Stack>

        <Divider sx={{ my: 4, borderColor: "#cfd8dc" }} />
        <Typography variant="body2" textAlign="center" color="#000">
          © 2026 Rao Muhammad Shayan
        </Typography>
      </Container>
    </Box>
  );
};

export default SettingPage;
