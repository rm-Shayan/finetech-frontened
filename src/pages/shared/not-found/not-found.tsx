import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ReportIcon from "@mui/icons-material/Report";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: "center" }}>
        <ReportIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
        <Typography variant="h3" fontWeight={800} gutterBottom>
          404
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Page Not Found
        </Typography>
        <Typography color="text.secondary" mb={4}>
          The page you are looking for doesn’t exist or has been moved.
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button variant="contained" color="primary" onClick={() => navigate("/")}>
            Home
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
