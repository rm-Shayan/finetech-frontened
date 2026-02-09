import {
  Box,
  Typography,
  Button,
  TextField,
  Avatar,
  Divider,
  Stack,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../../../store/store";

import {
  handleUserUpdate,
  handlePasswordUpdate,
} from "../../../utils/fun";

const PAGE_BG = "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)";

const ProfileUpdatePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector(
    (state: RootState) =>
      state.user?.user || state.bankOfficer?.user || state.sbpAdmin?.user
  );

  if (!user) return null;

  const role: "customer" | "bank_officer" | "sbp_admin" = user?.role;

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
  }, [user]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        px: { xs: 2, sm: 3, md: 6 },
        py: { xs: 3, md: 5 },
        bgcolor: PAGE_BG,
      }}
    >
      <Typography
        variant="h4"
        sx={{ fontWeight: 800, mb: 5, color: "#000000" }}
      >
        Update Profile
      </Typography>

      {/* Avatar */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
        <Avatar
          src={user?.avatar?.url}
          sx={{
            width: 96,
            height: 96,
            background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
          }}
        />
        <Button variant="contained" component="label">
          Upload Avatar
          <input
            hidden
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && setAvatar(e.target.files[0])}
          />
        </Button>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* User Info */}
      <Stack spacing={3} maxWidth={500}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />

        <Button
          variant="contained"
          sx={{
            background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
          }}
          onClick={() =>
            handleUserUpdate({
              role,
              dispatch,
              navigate,
              name,
              email,
              avatar,
            })
          }
        >
          Update Profile
        </Button>
      </Stack>

      <Divider sx={{ my: 6 }} />

      {/* Password Update */}
      <Typography variant="h5" sx={{ mb: 3, color: "#000" }}>
        Update Password
      </Typography>

      <Stack spacing={3} maxWidth={500}>
        <TextField
          label="Current Password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          fullWidth
        />
        <TextField
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          fullWidth
        />
        <TextField
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
        />

        <Button
          variant="contained"
          sx={{
            background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
          }}
          onClick={() =>
            handlePasswordUpdate({
              role,
              dispatch,
              navigate,
              currentPassword,
              newPassword,
              confirmPassword,
            })
          }
        >
          Update Password
        </Button>
      </Stack>
    </Box>
  );
};

export default ProfileUpdatePage;
