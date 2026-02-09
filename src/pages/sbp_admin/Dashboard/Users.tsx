import { useEffect, useState, useCallback } from "react";
import {
  Container,
  Typography,
  Box,
  Stack,
  CircularProgress,
  Modal,
  Button,
  TextField,
  MenuItem,
  Divider,
  InputAdornment,
  Paper,
  IconButton,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { getBanksThunk } from "../../../store/features/bank/thunk/bankthunk";
import {
  getAllUsersThunk,
  getAllBankOfficersThunk,
} from "../../../store/features/sbp_admin/thunk/sbp_admin.thunk";
import StatCard from "../../../components/StateCards";
import UserCard from "../../../components/UserCard";
import { useNavigate } from "react-router-dom";

const AdminUsersDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { users, bankOfficers, loadingUsers, loadingBankOfficers } =
    useSelector((state: RootState) => state.sbpAdmin);
  const user = useSelector((state: RootState) => state.sbpAdmin.user);
  const { banks } = useSelector((state: RootState) => state.banks);

  const isAdmin = user?.role === "sbp_admin";

  console.log("users", users?.users);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOfficers: 0,
    totalBanks: 0,
  });
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [bankFilter, setBankFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Fetch banks only if empty
  useEffect(() => {
    if (!banks?.length) {
      dispatch(getBanksThunk()).unwrap().catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // <- empty dependency array ensures it runs only once on mount

  // Auto-set bank filter for bank officers
  useEffect(() => {
    if (!isAdmin && banks?.length) {
      const bank = banks.find((b) => b._id === user?.bankId);
      setBankFilter(bank?.bankCode || "");
    }
  }, [user, banks, isAdmin]);

  // Load Users & Stats
  const loadData = useCallback(async () => {
    try {
      // Users first
      const usersRes = await dispatch(
        getAllUsersThunk({
          page: 1,
          bankCode: bankFilter,
          search,
          status: statusFilter,
        }),
      ).unwrap();

      setStats((prev) => ({
        ...prev,
        totalUsers: usersRes.data.total,
        totalBanks: banks?.length || prev.totalBanks,
      }));
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, bankFilter, search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (bankFilter) loadData();
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [bankFilter, search, statusFilter, loadData]);

  // Load Bank Officers on demand
  const loadBankOfficers = async () => {
    if (!isAdmin) return;

    try {
      const officersRes = await dispatch(
        getAllBankOfficersThunk({
          page: 1,
          bankCode: bankFilter,
          search,
          status: statusFilter,
        }),
      ).unwrap();

      setStats((prev) => ({
        ...prev,
        totalOfficers: officersRes.data.total,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* HEADER */}
      <Box mt={8}>
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          gap={2}
          mb={2}
        >
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              color: "#004d40",
              fontSize: { xs: "1.75rem", md: "2.125rem" },
            }}
          >
            User Management{" "}
            {isAdmin && (
              <Typography
                component="span"
                variant="h6"
                sx={{
                  color: "#26a69a",
                  display: { xs: "block", sm: "inline" },
                }}
              >
                (SBP Control)
              </Typography>
            )}
          </Typography>

          {isAdmin && (
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              sx={{
                bgcolor: "#00796b",
                color: "#fff",
                fontWeight: 700,
                px: 3,
                py: 1,
                textTransform: "none",
                alignSelf: { xs: "stretch", sm: "auto" },
                "&:hover": { bgcolor: "#004d40" },
              }}
              onClick={() =>
                navigate("/dashboard/admin/users/register-bank_oficer")
              }
            >
              Add Bank Officer
            </Button>
          )}
        </Box>
        <Divider sx={{ mb: 4, borderColor: "rgba(0, 77, 64, 0.1)" }} />
      </Box>

      {/* STATS */}
      <Box
        display="grid"
        gridTemplateColumns={{
          xs: "1fr",
          sm: "repeat(2,1fr)",
          md: "repeat(3,1fr)",
        }}
        gap={3}
        mb={4}
      >
        <StatCard
          title="Total Customers"
          count={stats.totalUsers}
          icon={<PeopleIcon />}
          color="#26a69a"
        />
        {isAdmin && (
          <>
            <StatCard
              title="Total Banks"
              count={stats.totalBanks}
              icon={<AccountBalanceIcon />}
              color="#26a69a"
            />
            <StatCard
              title="Bank Officers"
              count={stats.totalOfficers}
              icon={<AdminPanelSettingsIcon />}
              color="#26a69a"
            />
          </>
        )}
      </Box>

      {/* FILTERS */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 2.5 },
          mb: 4,
          borderRadius: 4,
          border: "1px solid #e2e8f0",
          background: "#fff",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.03)",
        }}
      >
        <Box
          display="flex"
          flexDirection={{ xs: "column", lg: "row" }}
          alignItems={{ xs: "stretch", lg: "center" }}
          gap={2.5}
        >
          <TextField
            placeholder="Search by name, email or reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{
              flex: { lg: 3 },
              bgcolor: "#f8fafc",
              "& .MuiOutlinedInput-root": { borderRadius: 3 },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
          />

          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            gap={2}
            sx={{ flex: { lg: 2 } }}
          >
            {isAdmin && (
              <TextField
                select
                label="Bank"
                value={bankFilter}
                onChange={(e) => setBankFilter(e.target.value)}
                size="small"
                fullWidth
                sx={{
                  bgcolor: "#f8fafc",
                  "& .MuiOutlinedInput-root": { borderRadius: 3 },
                  "& .MuiSelect-select": { color: "#000" }, // selected value
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        bgcolor: "#ffffff", // dropdown background
                      },
                    },
                  },
                }}
              >
                <MenuItem
                  value=""
                  sx={{
                    color: "#000",
                    "&:hover": { backgroundColor: "#f0f0f0", color: "#000" },
                  }}
                >
                  All Banks
                </MenuItem>
                {banks?.map((b: any) => (
                  <MenuItem
                    key={b._id}
                    value={b.bankCode}
                    sx={{
                      color: "#000",
                      "&:hover": { backgroundColor: "#f0f0f0", color: "#000" },
                    }}
                  >
                    {b.bankCode}
                  </MenuItem>
                ))}
              </TextField>
            )}

            <TextField
              select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              size="small"
              fullWidth
              sx={{
                bgcolor: "#f8fafc",
                "& .MuiOutlinedInput-root": { borderRadius: 3 },
                "& .MuiSelect-select": { color: "#000" },
              }}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      bgcolor: "#fff",
                    },
                  },
                },
              }}
            >
              <MenuItem
                value=""
                sx={{
                  color: "#000",
                  "&:hover": { backgroundColor: "#f0f0f0", color: "#000" },
                }}
              >
                All Status
              </MenuItem>
              <MenuItem
                value="active"
                sx={{
                  color: "#000",
                  "&:hover": { backgroundColor: "#f0f0f0", color: "#000" },
                }}
              >
                Active
              </MenuItem>
              <MenuItem
                value="inactive"
                sx={{
                  color: "#000",
                  "&:hover": { backgroundColor: "#f0f0f0", color: "#000" },
                }}
              >
                Inactive
              </MenuItem>
            </TextField>
          </Box>

          <Stack direction="row" spacing={1.5}>
            <Button
              variant="contained"
              onClick={loadData}
              startIcon={<FilterListIcon />}
              sx={{
                flex: 1,
                bgcolor: "#00796b",
                color: "#fff",
                fontWeight: 700,
                px: 4,
                borderRadius: 3,
                textTransform: "none",
                "&:hover": { bgcolor: "#004d40" },
              }}
            >
              Apply
            </Button>

            <IconButton
              onClick={() => {
                setSearch("");
                setBankFilter("");
                setStatusFilter("");
              }}
              sx={{
                bgcolor: "#f1f5f9",
                borderRadius: 3,
                "&:hover": { bgcolor: "#e2e8f0" },
              }}
            >
              <RestartAltIcon />
            </IconButton>
          </Stack>
        </Box>
      </Paper>

      {/* USER CARDS */}
      <Stack spacing={4}>
        {isAdmin && (
          <>
            <Button
              variant="outlined"
              sx={{ mb: 2 }}
              onClick={loadBankOfficers}
            >
              Load Bank Officers
            </Button>
            {bankOfficers && bankOfficers.users.length > 0 && (
              <>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ color: "#004d40" }}
                >
                  Bank Officers
                </Typography>
                {loadingBankOfficers ? (
                  <CircularProgress sx={{ color: "#00796b" }} />
                ) : (
                  <Stack spacing={2}>
                    {bankOfficers.users.map((u) => (
                      <UserCard
                        key={u._id}
                        user={u}
                        onClick={setSelectedUser}
                      />
                    ))}
                  </Stack>
                )}
              </>
            )}
          </>
        )}

        <Typography variant="h6" fontWeight={700} sx={{ color: "#004d40" }}>
          Users
        </Typography>
        {loadingUsers ? (
          <CircularProgress sx={{ color: "#00796b" }} />
        ) : (
          <Stack spacing={2}>
            {users?.users.map((u) => (
              <UserCard key={u._id} user={u} onClick={setSelectedUser} />
            ))}
          </Stack>
        )}
      </Stack>

      {/* MODAL */}
      <Modal open={!!selectedUser} onClose={() => setSelectedUser(null)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 400 },
            bgcolor: "linear-gradient(135deg, #38b2ac 0%, #319795 100%)",
            borderRadius: 3,
            boxShadow: 24,
            p: 4,
            color: "#fff",
          }}
        >
          {selectedUser && (
            <>
              <Typography variant="h6" fontWeight={700}>
                {selectedUser.name}
              </Typography>
              <Typography>Email: {selectedUser.email}</Typography>
              <Typography>Role: {selectedUser.role}</Typography>
              <Typography>
                Bank: {selectedUser?.bankName || selectedUser.bankCode || "N/A"}
              </Typography>
              <Typography>Status: {selectedUser.status || "active"}</Typography>
              <Button
                fullWidth
                sx={{ mt: 3, bgcolor: "#00796b", color: "#fff" }}
                variant="contained"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default AdminUsersDashboard;
