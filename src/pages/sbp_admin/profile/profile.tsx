import {
  Box,
  Typography,
  Avatar,
  Divider,
  Stack,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import type { RootState, AppDispatch } from "../../../store/store";
import { getBanksThunk } from "../../../store/features/bank/thunk/bankthunk";

const PAGE_BG = "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"; // Teal gradient background

const ProfilePage = () => {

  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector(
    (state: RootState) =>
      state.user?.user || state.bankOfficer?.user || state.sbpAdmin?.user
  );

  const banks = useSelector((state: RootState) => state.banks.banks);
  const [userBankName, setUserBankName] = useState("");

  useEffect(() => {
    if ((!banks || banks.length === 0) && user?.bankId) {
      dispatch(getBanksThunk()).unwrap().catch(console.error);
    }
  }, [banks, user?.bankId, dispatch]);

  useEffect(() => {
    if (user?.bankId && banks?.length) {
      const bank = banks.find((b) => b._id === user.bankId);
      if (bank) setUserBankName(bank.bankName);
    }
  }, [user?.bankId, banks]);

  if (!user) return null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: PAGE_BG,
        width: "100%",
        px: { xs: 2, sm: 3, md: 6 },
        py: { xs: 3, md: 5 },
      }}
    >
      {/* PAGE TITLE */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          mb: { xs: 3, md: 5 },
          fontSize: { xs: "1.6rem", md: "2.125rem" },
          color: "#000000",
        }}
      >
        Profile
      </Typography>

      {/* HEADER ROW */}
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 3 },
          mb: 4,
        }}
      >
        <Avatar
          src={user?.avatar?.url}
          sx={{
            width: { xs: 72, sm: 96 },
            height: { xs: 72, sm: 96 },
            fontSize: { xs: 28, sm: 36 },
            bgcolor: "transparent",
            background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
            color: "#fff",
          }}
        >
          {user?.name?.charAt(0)}
        </Avatar>

        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
              color: "#000000",
            }}
          >
            {user?.name}
          </Typography>

          <Typography
            sx={{
              color: "#000000",
              textTransform: "capitalize",
              fontWeight: 500,
            }}
          >
            {user?.role?.replace("_", " ")}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 4, borderColor: "rgba(0,0,0,0.2)" }} />

      {/* DETAILS */}
      <Stack
        spacing={3}
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", md: 720 },
          color: "#000000",
        }}
      >
        <Box>
          <Typography variant="body2" color="rgba(0,0,0,0.7)">
            Email
          </Typography>
          <Typography fontWeight={500} sx={{ wordBreak: "break-word" }}>
            {user?.email}
          </Typography>
        </Box>

        {userBankName && (
          <Box>
            <Typography variant="body2" color="rgba(0,0,0,0.7)">
              Bank
            </Typography>
            <Typography fontWeight={500}>{userBankName}</Typography>
          </Box>
        )}
      </Stack>   
    </Box>
  );
};

export default ProfilePage;
