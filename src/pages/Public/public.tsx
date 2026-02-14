import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import ReportIcon from "@mui/icons-material/Report";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import VerifiedIcon from "@mui/icons-material/Verified";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import GroupIcon from "@mui/icons-material/Group";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { useNavigate } from "react-router-dom";

export default function FinetechLandingPage() {
    const API_URL = import.meta.env.VITE_PROD_URL;
    const navigate=useNavigate()

if (!API_URL) {
  throw new Error("VITE_PROD_URL is not defined! Check your .env file.");
}
 

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh" }}>
      {/* ================= HEADER ================= */}
      <AppBar position="sticky" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AccountBalanceIcon sx={{ color: "#0f766e" }} />
            <Typography variant="h6" fontWeight={800}>
              Finetech
            </Typography>
          </Box>
          <Button variant="outlined" onClick={()=>navigate(`${API_URL}/login`)}>Login</Button>
        </Toolbar>
      </AppBar>

      {/* ================= HERO ================= */}
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column-reverse", md: "row" },
            gap: 6,
            py: 12,
            alignItems: "center",
          }}
        >
          <Box flex={1}>
            <Typography variant="h3" fontWeight={900} gutterBottom>
              Report Banking Fraud & Scams Across Pakistan
            </Typography>
            <Typography variant="h6" color="text.secondary" mb={4}>
              <strong>Finetech</strong> is a national digital platform under the
              vision of <strong>State Bank of Pakistan</strong> to report fraud,
              scams, and unauthorized banking activities safely and efficiently.
            </Typography>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button size="large" variant="contained" onClick={()=>navigate(`${import.meta.env.VITE_FRONT_URL}/dashboard/user/complaints`)}>
                File a Complaint
              </Button>
              <Button size="large" variant="outlined">
                How It Works
              </Button>
            </Box>
          </Box>

          <Box
            flex={1}
            sx={{
              height: { xs: 220, md: 320 },
              borderRadius: 5,
              background:
                "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              px: 4,
              boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
            }}
          >
            <Typography variant="h5" fontWeight={700}>
              Secure • Centralized • SBP Supervised Platform
            </Typography>
          </Box>
        </Box>
      </Container>

      {/* ================= STATS ================= */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>
          {[
            ["50+", "Banks Connected"],
            ["120K+", "Complaints Processed"],
            ["24/7", "Support Availability"],
            ["99%", "Resolved Cases"],
          ].map(([count, label]) => (
            <Card key={label} sx={{ width: 220, borderRadius: 4 }}>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" fontWeight={800} color="#0f766e">
                  {count}
                </Typography>
                <Typography color="text.secondary">{label}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* ================= FEATURES ================= */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" textAlign="center" fontWeight={800} mb={6}>
          Why Choose Finetech?
        </Typography>

        <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
          {[
            {
              icon: <SecurityIcon />,
              title: "Secure & Confidential",
              desc: "All complaints are encrypted and handled with strict security policies.",
            },
            {
              icon: <ReportIcon />,
              title: "One Platform – All Banks",
              desc: "Submit complaints for any Pakistani bank in a single system.",
            },
            {
              icon: <AccountBalanceIcon />,
              title: "SBP Oversight",
              desc: "Operates under regulatory supervision of the State Bank of Pakistan.",
            },
            {
              icon: <HowToRegIcon />,
              title: "Easy Registration",
              desc: "Simple sign-up process with secure identity verification.",
            },
          ].map((f) => (
            <Card key={f.title} sx={{ width: 300, borderRadius: 4 }}>
              <CardContent>
                <Box sx={{ color: "#0f766e", fontSize: 42, mb: 2 }}>{f.icon}</Box>
                <Typography variant="h6" fontWeight={700}>{f.title}</Typography>
                <Typography color="text.secondary">{f.desc}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* ================= HOW IT WORKS ================= */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" textAlign="center" fontWeight={800} mb={6}>
          How Finetech Works
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>
          {[
            {
              icon: <HowToRegIcon />,
              title: "Register / Login",
              desc: "Sign in securely using your verified identity.",
            },
            {
              icon: <ReportIcon />,
              title: "Submit Complaint",
              desc: "Provide details, bank info, and upload evidence.",
            },
            {
              icon: <VerifiedIcon />,
              title: "SBP Review",
              desc: "Complaint is forwarded to relevant bank & SBP for investigation.",
            },
            {
              icon: <SupportAgentIcon />,
              title: "Resolution & Tracking",
              desc: "Track progress and receive official updates.",
            },
          ].map((step) => (
            <Card key={step.title} sx={{ width: 260, borderRadius: 4 }}>
              <CardContent>
                <Box sx={{ color: "#0f766e", fontSize: 38, mb: 1 }}>{step.icon}</Box>
                <Typography fontWeight={700}>{step.title}</Typography>
                <Typography color="text.secondary">{step.desc}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* ================= WHO CAN USE ================= */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" textAlign="center" fontWeight={800} mb={6}>
          Who Can Use Finetech
        </Typography>

        <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { icon: <GroupIcon />, title: "Banks & Employees" },
            { icon: <EmojiPeopleIcon />, title: "General Public" },
            { icon: <AccountBalanceIcon />, title: "Regulators / Auditors" },
          ].map((u) => (
            <Card key={u.title} sx={{ width: 260, borderRadius: 4 }}>
              <CardContent sx={{ textAlign: "center" }}>
                <Box sx={{ color: "#0f766e", fontSize: 42, mb: 1 }}>{u.icon}</Box>
                <Typography fontWeight={700}>{u.title}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* ================= TESTIMONIALS / FEEDBACK ================= */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" textAlign="center" fontWeight={800} mb={6}>
          Feedback (Demo)
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }} onClick={()=>navigate(`${import.meta.env.VITE_FRONT_URL}/dashboard/user/complaints`)}>
          {[1, 2, 3].map((i) => (
            <Card key={i} sx={{ width: 300, borderRadius: 4 }}>
              <CardContent>
                <Typography fontWeight={700}>User {i}</Typography>
                <Typography color="text.secondary" mb={2}>
                  "Finetech helped me report a banking fraud quickly and safely. Highly recommended!"
                </Typography>
                <Box sx={{ display: "flex", gap: 1, color: "#0f766e" }}>
                  {[...Array(5)].map((_, j) => (
                    <ThumbUpIcon key={j} sx={{ fontSize: 18 }} />
                  ))}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* ================= CTA ================= */}
      <Box sx={{ bgcolor: "#0f766e", color: "white", py: 10, textAlign: "center" }} onClick={()=>navigate(`${import.meta.env.VITE_FRONT_URL}/dashboard/user/complaints`)}>
        <Typography variant="h4" fontWeight={800} mb={2}>
          Protect Yourself From Banking Fraud
        </Typography>
        <Typography mb={4}>
          Report suspicious activities today and help make Pakistan’s banking system safer.
        </Typography>
        <Button size="large" variant="contained" color="inherit">
          File Complaint Now
        </Button>
      </Box>

      {/* ================= FOOTER ================= */}
      <Box sx={{ bgcolor: "#062e2a", color: "white", py: 4 }}>
        <Typography textAlign="center" fontSize={14}>
          © {new Date().getFullYear()} Finetech — National Banking Fraud Reporting
          System (Demo)
        </Typography>
      </Box>
    </Box>
  );

}
