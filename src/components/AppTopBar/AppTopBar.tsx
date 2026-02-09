import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Paper,
  InputBase,

} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  WavingHandOutlined as WelcomeIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { getBanksThunk } from "../../store/features/bank/thunk/bankthunk";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import ProfileMenu from "../ProfileMenu";

const PRIMARY_TEAL = "#11998e";
const TEAL_GRADIENT = "linear-gradient(90deg, #38ef7d, #11998e)";

const DashboardHeader = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const user = useSelector(
    (state: RootState) =>
      state.user?.user || state.bankOfficer?.user || state.sbpAdmin?.user,
  );
  const dispatch = useDispatch<AppDispatch>();
  const banksState = useSelector(
    (state: RootState) => state.banks?.banks ?? [],
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const isCustomer = user?.role == "customer";

  useEffect(() => {
  if (!banksState || banksState.length === 0) {
    dispatch(getBanksThunk())
      .unwrap()
      .catch(console.error);
  }
}, [dispatch, banksState]);



  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    const value = searchValue.trim();
    if (!value) return;

    const lowerValue = value.toLowerCase();

    const statusList = ["pending", "resolved", "closed", "in_progress"];


    /* ================= STATUS CHECK ================= */
    if (statusList.includes(lowerValue)) {
      navigate(`/dashboard/admin/complaints?status=${lowerValue}`);
      return;
    }

    /* ================= BANK CHECK ================= */
    const matchedBank = banksState?.find((bank) => {
      return (
        bank.bankCode?.toLowerCase() === lowerValue ||
        bank.bankName?.toLowerCase().includes(lowerValue)
      );
    });

    if (matchedBank) {
      navigate(`/dashboard/admin/complaints?bankCode=${matchedBank.bankCode}`);
      return;
    }

    /* ================= FALLBACK SEARCH ================= */
    navigate(`/dashboard/admin/complaints?search=${encodeURIComponent(value)}`);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "2px solid #e2e8f0",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        height: showMobileSearch ? "auto" : { xs: 70, md: 75 },
        transition: "all 0.2s ease-in-out",
        overflow: "hidden",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "unset !important",
          height: "100%",
          px: { xs: 1.5, sm: 3 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            height: 70,
          }}
        >
          {/* Left Area: Menu & Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <IconButton
              onClick={onMenuClick}
              sx={{ display: { md: "none" }, color: PRIMARY_TEAL }}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 900,
                background: TEAL_GRADIENT,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "1.3rem", sm: "1.6rem", md: "1.9rem" },
                letterSpacing: "-1.2px",
              }}
            >
              Finetech
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Right Area: Welcome Message & Profile */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* 🚀 Welcome Message for Customer & Others */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 1.5,
                bgcolor: "#f0fdf4",
                px: 2.5,
                py: 1,
                borderRadius: "50px",
                border: "1px solid #d1fae5",
              }}
            >
              <WelcomeIcon sx={{ color: PRIMARY_TEAL, fontSize: 20 }} />
              <Typography
                variant="body2"
                sx={{ fontWeight: 800, color: "#065f46", fontSize: "0.9rem" }}
              >
                Hi, {user?.name?.split(" ")[0]}!
              </Typography>
            </Box>

            {/* Search (Only for non-customers) */}
            {!isCustomer && (
              <>
                <Paper
                  elevation={0}
                  sx={{
                    display: { xs: "none", lg: "flex" },
                    alignItems: "center",
                    px: 2,
                    borderRadius: "50px",
                    bgcolor: "#f1f5f9",
                    border: "1px solid #e2e8f0",
                    width: 250,
                    height: 45,
                  }}
                >
                  <SearchIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                  <InputBase
                    autoFocus
                    fullWidth
                    placeholder="Search..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    sx={{ ml: 1, fontWeight: 500 }}
                  />
                </Paper>

                <IconButton
                  onClick={() => setShowMobileSearch(!showMobileSearch)}
                  sx={{
                    display: { lg: "none" },
                    color: showMobileSearch ? PRIMARY_TEAL : "#64748b",
                  }}
                >
                  {showMobileSearch ? <CloseIcon /> : <SearchIcon />}
                </IconButton>
              </>
            )}

            {/* Profile Section */}
            <Box
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                cursor: "pointer",
                p: "4px 4px 4px 14px",
                borderRadius: "50px",
                bgcolor: "#f8fafc",
                border: "1.5px solid #e2e8f0",
                "&:hover": { borderColor: PRIMARY_TEAL },
              }}
            >
              <Box
                sx={{
                  display: { xs: "none", sm: "block" },
                  textAlign: "right",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 900,
                    color: "#1e293b",
                    fontSize: "1rem",
                    lineHeight: 1,
                  }}
                >
                  {user?.name?.split(" ")[0]}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: PRIMARY_TEAL,
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    textTransform: "uppercase",
                  }}
                >
                  {user?.role?.replace("_", " ")}
                </Typography>
              </Box>
              <Avatar
                src={user?.avatar?.url}
                sx={{
                  width: 42,
                  height: 42,
                  background: TEAL_GRADIENT,
                  border: "2px solid #fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                {user?.name?.charAt(0)}
              </Avatar>
            </Box>
          </Box>
        </Box>

        {/* Mobile Search Input Area */}
        {!isCustomer && showMobileSearch && (
          <Box
            sx={{
              width: "100%",
              pb: 2,
              px: 1,
              display: { lg: "none" },
              animation: "slideDown 0.3s ease-out",
            }}
          >
            <Paper
              elevation={0}
              sx={{
                display: "flex",
                alignItems: "center",
                px: 2,
                py: 1,
                borderRadius: "12px",
                bgcolor: "#f1f5f9",
                border: `2px solid ${PRIMARY_TEAL}`,
              }}
            >
              <SearchIcon sx={{ color: PRIMARY_TEAL }} />
              <InputBase
                autoFocus
                fullWidth
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
                sx={{ ml: 1, fontWeight: 500 }}
              />
            </Paper>
          </Box>
        )}
      </Toolbar>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>


    {/* Profile Section */}
<Box
  onClick={(e) => setAnchorEl(e.currentTarget)}
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    cursor: "pointer",
    p: "4px 4px 4px 14px",
    borderRadius: "50px",
    bgcolor: "#f8fafc",
    border: "1.5px solid #e2e8f0",
    "&:hover": { borderColor: PRIMARY_TEAL },
  }}
>
  <Box
    sx={{
      display: { xs: "none", sm: "block" },
      textAlign: "right",
    }}
  >
    <Typography
      variant="body1"
      sx={{
        fontWeight: 900,
        color: "#1e293b",
        fontSize: "1rem",
        lineHeight: 1,
      }}
    >
      {user?.name?.split(" ")[0]}
    </Typography>
    <Typography
      variant="body2"
      sx={{
        color: PRIMARY_TEAL,
        fontWeight: 800,
        fontSize: "0.85rem",
        textTransform: "uppercase",
      }}
    >
      {user?.role?.replace("_", " ")}
    </Typography>
  </Box>
  <Avatar
    src={user?.avatar?.url}
    sx={{
      width: 42,
      height: 42,
      background: TEAL_GRADIENT,
      border: "2px solid #fff",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    }}
  >
    {user?.name?.charAt(0)}
  </Avatar>
</Box>

{/* Profile Menu */}
<ProfileMenu
  anchorEl={anchorEl}
  handleClose={() => setAnchorEl(null)}
/>

    </AppBar>
  );
};

export default DashboardHeader;
