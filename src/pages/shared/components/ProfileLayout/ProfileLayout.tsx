import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const ProfileLayout = () => {
  return (
    <Box sx={{ width: "100%", flexGrow: 1 }}>
      <Outlet />
    </Box>
  );
};

export default ProfileLayout;
