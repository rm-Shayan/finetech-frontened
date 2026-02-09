import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SecurityIcon from "@mui/icons-material/Security";

export default function Unauthorized() {
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
        <SecurityIcon sx={{ fontSize: 60, color: "error.main", mb: 2 }} />
        <Typography variant="h3" fontWeight={800} gutterBottom>
          403
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Access Denied
        </Typography>
        <Typography color="text.secondary" mb={4}>
          You don’t have permission to access this page.
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
