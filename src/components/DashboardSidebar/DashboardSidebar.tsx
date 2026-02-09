import {
  Drawer,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  GridView as DashboardIcon,
  ChatBubbleOutline as ReportIcon,
  SettingsOutlined as SettingsIcon,
  LogoutOutlined as LogoutIcon,
  KeyboardArrowLeft as CollapseIcon,
  Menu as ExpandIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import PeopleIcon from "@mui/icons-material/People";
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
import type { RootState, AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";

type UserRole = "customer" | "bank_officer" | "sbp_admin";

const TEAL_GRADIENT = "linear-gradient(90deg, #38ef7d, #11998e)";
const SOFT_TEAL_BG = "#e6f9f0";

const DashboardSidebar = ({ drawerWidth = 240, mobileOpen, onClose }: any) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // xs
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg")); // sm & md

  // 🔹 collapsed by default on sm/md, expanded on lg+
  const [collapsed, setCollapsed] = useState(isTablet ? true : false);

  const user = useSelector(
    (state: RootState) =>
      state.user?.user || state.bankOfficer?.user || state.sbpAdmin?.user,
  );

  const dispatch = useDispatch<AppDispatch>();
  const role = user?.role as UserRole;

  const menuItems = [
    {
      text: "Overview",
      icon: <DashboardIcon />,
      path:
        role === "customer"
          ? "/dashboard/user"
          : role === "bank_officer"
            ? "/dashboard/bank"
            : "/dashboard/admin",
    },
    {
      text: "Complaints",
      icon: <ReportIcon />,
      path:
        role === "customer"
          ? "/dashboard/user/complaints"
          : role === "bank_officer"
            ? "/dashboard/bank/complaints"
            : "/dashboard/admin/complaints",
    },

    // ✅ Users — role based (ONLY ONE)
    ...(role === "sbp_admin"
      ? [
          {
            text: "Users",
            icon: <PeopleIcon />,
            path: "/dashboard/admin/users",
          },
        ]
      : role === "bank_officer"
        ? [
            {
              text: "Users",
              icon: <PeopleIcon />,
              path: "/dashboard/bank/users",
            },
          ]
        : []),

    {
      text: "Settings",
      icon: <SettingsIcon />,
      path:
        role === "customer"
          ? "/dashboard/user/settings"
          : role === "bank_officer"
            ? "/dashboard/bank/settings"
            : "/dashboard/admin/settings",
    },
  ];

  const handleLogout = async () => {
    try {
      if (role === "customer") await dispatch(logoutThunk()).unwrap();
      else if (role === "bank_officer")
        await dispatch(bankOfficerLogoutThunk()).unwrap();
      else if (role === "sbp_admin")
        await dispatch(sbpAdminLogoutThunk()).unwrap();

      navigate("/login");
    } catch (err: any) {
      // If token expired, try refresh
      if (err?.statusCode === 401) {
        try {
          if (role === "customer") await dispatch(refreshTokenThunk()).unwrap();
          else if (role === "bank_officer")
            await dispatch(bankOfficerRefreshThunk()).unwrap();
          else if (role === "sbp_admin")
            await dispatch(sbpAdminRefreshThunk()).unwrap();

          handleLogout(); // Retry logout after refresh
        } catch {
          navigate("/login");
        }
      }
    }
  };

  const handleNavigation = (path: string) => {
    if (location.pathname === path) return;
    navigate(path);
    if (isMobile) onClose();
  };

  // Update collapsed state when resizing
  useEffect(() => {
    if (isTablet) setCollapsed(true);
    if (!isTablet && !isMobile) setCollapsed(false);
  }, [isTablet, isMobile]);

  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "#fff",
      }}
    >
      <Box sx={{ py: 3 }} />

      <List sx={{ flex: 1, px: collapsed ? 0 : 2, mt: 4 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Tooltip
              key={item.text}
              title={collapsed ? item.text : ""}
              placement="right"
              arrow
            >
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  minHeight: 52,
                  justifyContent: collapsed ? "center" : "flex-start",
                  px: collapsed ? 1.5 : 2,
                  mb: 1.5,
                  borderRadius: "12px",
                  transition: "all 0.3s",
                  bgcolor: isActive ? SOFT_TEAL_BG : "transparent",
                  "&:hover": { bgcolor: isActive ? SOFT_TEAL_BG : "#f0fff4" },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: collapsed ? 0 : 2,
                    color: isActive ? "#11998e" : "#94a3b8",
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                {!collapsed && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: "0.92rem",
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? "#0d6b5e" : "#64748b",
                    }}
                  />
                )}

                {isActive && !collapsed && (
                  <motion.div
                    layoutId="active-dot"
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: TEAL_GRADIENT,
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>

      <Box sx={{ p: 2 }}>
        <Divider sx={{ mb: 2, opacity: 0.1, bgcolor: "#11998e" }} />

        <ListItemButton
          onClick={handleLogout}
          sx={{
            justifyContent: collapsed ? "center" : "flex-start",
            borderRadius: "12px",
            color: "#64748b",
            mb: 2,
            "&:hover": { bgcolor: "#fef2f2", color: "#ef4444" },
          }}
        >
          <ListItemIcon
            sx={{ minWidth: 0, mr: collapsed ? 0 : 2, color: "inherit" }}
          >
            <LogoutIcon />
          </ListItemIcon>
          {!collapsed && (
            <ListItemText
              primary="Sign Out"
              primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: 600 }}
            />
          )}
        </ListItemButton>

        {/* Toggle button */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <IconButton
            onClick={() => setCollapsed(!collapsed)}
            sx={{
              bgcolor: SOFT_TEAL_BG,
              border: "1px solid #d1fae5",
              width: 38,
              height: 38,
              color: "#11998e",
              "&:hover": { bgcolor: "#ccfbf1", transform: "scale(1.1)" },
            }}
          >
            {collapsed ? (
              <ExpandIcon fontSize="small" />
            ) : (
              <CollapseIcon fontSize="small" />
            )}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? mobileOpen : true}
      onClose={onClose}
      sx={{
        width: collapsed ? 80 : drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: collapsed ? 80 : drawerWidth,
          boxSizing: "border-box",
          transition: "width 0.3s",
          overflowX: "hidden",
          borderRight: "1px solid #e6f9f0",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default DashboardSidebar;
