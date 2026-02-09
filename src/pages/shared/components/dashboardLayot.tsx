// layouts/DashboardLayout.tsx
import { useState } from "react";
import { Box, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import DashboardHeader from "../../../components/AppTopBar";
import DashboardSidebar from "../../../components/DashboardSidebar";

const drawerWidth = 260;
const collapsedWidth = 80; // Agar sidebar collapse ho

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const collapsed = true;

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <CssBaseline />

      {/* 🔹 Header: Toggle state pass karna zaruri hai */}
      <DashboardHeader onMenuClick={handleDrawerToggle} />

      {/* 🔹 Sidebar */}
      <DashboardSidebar
        drawerWidth={drawerWidth}
        collapsedWidth={collapsedWidth}
        mobileOpen={mobileOpen}
        collapsed={collapsed}
        onClose={() => setMobileOpen(false)}
      />

      {/* 🔹 Main Content Area */}
<Box
  sx={{
    width: "100%",
    maxWidth: {
      xs: "90%",
      sm: "90%",
      md: "90%",
      lg: "92%",
    },
    mx: "auto",
    minWidth: 0,
  }}
>
  <Outlet />
</Box>

    </Box>
  );
};

export default DashboardLayout;
