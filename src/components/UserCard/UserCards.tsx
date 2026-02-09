import { Paper, Avatar, Box, Typography } from "@mui/material";

export const UserCard = ({ user, onClick }: any) => {
  return (
    <Paper
      onClick={() => onClick(user)}
      sx={{
        p: 2,
        borderRadius: 3,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 2,
        background: "linear-gradient(135deg, #38b2ac 0%, #319795 100%)", // Pure teal gradient
        color: "#fff",
        "&:hover": {
          boxShadow: 6,
          transform: "scale(1.02)",
          transition: "0.3s",
        },
      }}
    >
      <Avatar
        src={user?.avatar?.url || ""}
        alt={user.name}
        sx={{ border: "2px solid #fff" }}
      />
      <Box>
        <Typography fontWeight={600} component="div">
          {user.name}
        </Typography>

        <Typography
          variant="body2"
          component="div"
          sx={{ color: "rgba(255,255,255,0.8)" }}
        >
          {user.email}
        </Typography>

        <Typography
          variant="caption"
          component="div"
          sx={{ color: "rgba(255,255,255,0.7)" }}
        >
          Role: {user.role}
        </Typography>

        <Typography
          variant="caption"
          component="div"
          sx={{ color: "rgba(255,255,255,0.7)" }}
        >
          Bank: {user.bankCode || "N/A"}
        </Typography>

        <Typography
          variant="caption"
          component="div"
          sx={{ color: "rgba(255,255,255,0.7)" }}
        >
          Status: {user.status || "active"}
        </Typography>
      </Box>
    </Paper>
  );
};
