import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import {
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

import {
  logoutThunk,
  refreshTokenThunk,
} from "../../store/features/user/thunk/user.thunk";
import {
  sbpAdminLogoutThunk,
  sbpAdminRefreshThunk,
} from "../../store/features/sbp_admin/thunk/sbp_admin.thunk";
import {
  bankOfficerLogoutThunk,
  bankOfficerRefreshThunk,
} from "../../store/features/bankOfficer/thunk/bankOfficer.thunk";

interface Props {
  anchorEl: HTMLElement | null;
  handleClose: () => void;
}

const ProfileMenu = ({ anchorEl, handleClose }: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(
    (state: RootState) =>
      state.user.user || state.bankOfficer.user || state.sbpAdmin.user
  );

  const role = user?.role;

  // Navigate dynamically based on role
  const handleNavigate = (type: "profile" | "settings") => {
    let basePath = "";
    if (role === "customer") basePath = "/dashboard/user";
    else if (role === "sbp_admin") basePath = "/dashboard/admin";
    else if (role === "bank_officer") basePath = "/dashboard/bank";

    if (type === "profile") navigate(`${basePath}/profile`);
    else if (type === "settings") navigate(`${basePath}/settings`);

    handleClose(); // close the menu
  };

  // Logout dynamically based on role
  const handleLogout = async () => {
    try {
      if (role === "customer") await dispatch(logoutThunk()).unwrap();
      else if (role === "sbp_admin") await dispatch(sbpAdminLogoutThunk()).unwrap();
      else if (role === "bank_officer") await dispatch(bankOfficerLogoutThunk()).unwrap();
      navigate("/login");
    } catch (err: any) {
      // If token expired, try refresh
      try {
        if (role === "customer") await dispatch(refreshTokenThunk()).unwrap();
        else if (role === "sbp_admin") await dispatch(sbpAdminRefreshThunk()).unwrap();
        else if (role === "bank_officer") await dispatch(bankOfficerRefreshThunk()).unwrap();
        handleLogout();
      } catch {
        navigate("/login");
      }
    }
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      PaperProps={{ sx: { mt: 1.5, width: 220, borderRadius: "16px", p: 1 } }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <MenuItem
        sx={{ fontWeight: 600, gap: 1.5 }}
        onClick={() => handleNavigate("profile")}
      >
        <PersonIcon color="primary" /> Profile
      </MenuItem>

      <MenuItem
        sx={{ fontWeight: 600, gap: 1.5 }}
        onClick={() => handleNavigate("settings")}
      >
        <SettingsIcon color="primary" /> Settings
      </MenuItem>

      <Divider sx={{ my: 1 }} />

      <MenuItem
        sx={{ fontWeight: 700, gap: 1.5, color: "#ef4444" }}
        onClick={handleLogout}
      >
        <LogoutIcon /> Sign Out
      </MenuItem>
    </Menu>
  );
};

export default ProfileMenu;
