import { Box, Paper, Typography } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

interface CardItemProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const CardItem = ({ title, value, icon, color }: CardItemProps) => (
  <Paper
    elevation={8}
    sx={{
      p: 3,
      borderRadius: 3,
      flex: "1 1 240px",
      minWidth: 220,
      display: "flex",
      alignItems: "center",
      gap: 2,
      transition: "all 0.3s ease",
      cursor: "default",
      background: `linear-gradient(135deg, ${color}22, ${color}08)`,
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
      },
    }}
  >
    <Box
      sx={{
        width: 54,
        height: 54,
        borderRadius: "50%",
        bgcolor: `${color}33`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color,
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>

    <Box>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h5" fontWeight={800}>
        {value ?? 0}
      </Typography>
    </Box>
  </Paper>
);

interface Props {
  data: any;
  role: "customer" | "bank_officer" | "sbp_admin";
}

const DashboardCards = ({ data, role }: Props) => {
  if (!data?.complaintStats) return null;

  const stats = data.complaintStats;

  console.log("data in card", data.complaintStats);
  const totalComplaints = data.totalComplaints;

  const resolvedForUser = (stats.resolved ?? 0) + (stats.closed ?? 0);

  /* ================= CUSTOMER ================= */
  const customerCards: CardItemProps[] = [
    {
      title: "Total Complaints",
      value: totalComplaints,
      icon: <AssignmentIcon />,
      color: "#0f766e",
    },
    {
      title: "Resolved",
      value: resolvedForUser, // resolved + closed
      icon: <CheckCircleIcon />,
      color: "#16a34a",
    },
    {
      title: "Rejected",
      value: stats.rejected ?? 0,
      icon: <CancelIcon />,
      color: "#dc2626",
    },
    {
      title: "Escalated",
      value: stats.escalated ?? 0,
      icon: <TrendingUpIcon />,
      color: "#ea580c",
    },
    {
      title: "Pending",
      value: stats.pending ?? 0,
      icon: <PendingActionsIcon />,
      color: "#ca8a04",
    },
    {
      title: "In Progress",
      value: stats.in_progress ?? 0,
      icon: <AutorenewIcon />,
      color: "#2563eb",
    },
  ];

  /* ================= STAFF / ADMIN ================= */
  const staffCards: CardItemProps[] = [
    {
      title: "Total Complaints",
      value: totalComplaints,
      icon: <AssignmentIcon />,
      color: "#0f766e",
    },
    {
      title: "In Progress",
      value: stats.in_progress ?? 0,
      icon: <AutorenewIcon />,
      color: "#2563eb",
    },
    {
      title: "Resolved",
      value: stats.resolved ?? 0,
      icon: <CheckCircleIcon />,
      color: "#16a34a",
    },
    {
      title: "Rejected",
      value: stats.rejected ?? 0,
      icon: <CancelIcon />,
      color: "#dc2626",
    },
  ];

  const cards = role === "customer" ? customerCards : staffCards;

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "flex-start", // 🚀 Ensure cards start from absolute left
        gap: { xs: 2, md: 3 }, // Gap spacing
        width: "100%",
        p: 0,
        m: 0,
        "& > *": {
          // 🚀 Har bache (CardItem) par width force karein
          width: {
            xs: "100%",
            sm: "calc(50% - 16px)",
            md: "calc(33.33% - 20px)",
            lg: "calc(25% - 24px)",
          },
          flexGrow: 0,
          flexShrink: 0,
        },
      }}
    >
      {cards.map((card) => (
        <CardItem key={`${role}-${card.title}`} {...card} />
      ))}
    </Box>
  );
};

export default DashboardCards;
