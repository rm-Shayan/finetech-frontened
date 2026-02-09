import { Paper, Typography, Box } from "@mui/material";

export const StatCard = ({ title, count, icon, color }: any) => (
  <Paper
    sx={{
      flex: "1 1 300px", // responsive basis
      display: "flex",
      alignItems: "center",
      p: 3,
      borderRadius: 4,
      boxShadow: 3,
      cursor: "pointer",
      background: color || "linear-gradient(135deg, #38b2ac 0%, #319795 100%)",
      color: "#fff",
      minWidth: 250,
      "&:hover": {
        transform: "scale(1.03)",
        transition: "0.3s",
        boxShadow: 6,
      },
    }}
  >
    <Box
      sx={{
        mr: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 50,
        height: 50,
        borderRadius: "50%",
        bgcolor: "rgba(255,255,255,0.2)",
      }}
    >
      {icon}
    </Box>
    <Box sx={{ flex: 1 }}>
      <Typography fontWeight={700}>{title}</Typography>
      <Typography fontWeight={600} variant="h6">
        {count}
      </Typography>
    </Box>
  </Paper>
);
