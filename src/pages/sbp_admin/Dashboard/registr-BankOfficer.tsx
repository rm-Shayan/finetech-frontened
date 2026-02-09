import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  MenuItem,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../store/store";
import {
  registerBankOfficerThunk,
  sbpAdminRefreshThunk,
} from "../../../store/features/sbp_admin/thunk/sbp_admin.thunk";
import { AlertService } from "../../../utils/service/alert.service";
import { registerSchema } from "../auth/validation/registerBankOfficer";
import { getBanksThunk } from "../../../store/features/bank/thunk/bankthunk";
import { useEffect } from "react";
import { GlobalLoader } from "../../../components/loader";

interface RegisterBankOfficerFormValues {
  name: string;
  email: string;
  password: string;
  bankId: string;
}

const BankOfficerRegisterForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => state.sbpAdmin.loading);
  const { banks } = useSelector((state: RootState) => state.banks);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterBankOfficerFormValues>({
    resolver: yupResolver(registerSchema),
  });

  // Fetch banks on mount
  useEffect(() => {
    dispatch(getBanksThunk());
  }, [dispatch]);

  const onSubmit = async (data: RegisterBankOfficerFormValues) => {
    const result = await AlertService.confirm(
      "Register Bank Officer",
      "Are you sure you want to create this account?",
    );
    if (!result.isConfirmed) return;

    const submitData = async () => {
      try {
        await dispatch(
          registerBankOfficerThunk({
            ...data,
            role: "bank_officer",
          }),
        ).unwrap();

        AlertService.success("Success", "Bank Officer registered successfully");
      } catch (err: unknown) {
        const error = err as { message?: string; statusCode?: number };

        AlertService.error(
          "Error",
          error instanceof Error ? error.message : "Something went wrong",
        );

        // Token expired → try refresh
        if (error.statusCode === 401) {
          try {
            await dispatch(sbpAdminRefreshThunk()).unwrap();
            // retry submission once after refresh
            await submitData();
          } catch (refreshError) {
            // if refresh failed → redirect to login
            window.location.href = "/admin/login";
          }
        }
      }
    };

    // Initial submit
    await submitData();
  };

  return (
    <>
      <GlobalLoader open={loading} />
      <Box
        sx={{
          minHeight: { xs: "auto", sm: "70vh" }, // small screens auto, medium+ 80% viewport
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #0f766e, #14b8a6)",
          px: { xs: 2, sm: 4 },
          py: { xs: 4, sm: 6 },
          mt: 4,
        }}
      >
        <Paper
          elevation={24}
          sx={{
            width: "100%",
            maxWidth: 480,
            borderRadius: 4,
            p: { xs: 3, sm: 5 },
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          }}
        >
          {/* Header */}
          <Stack spacing={1.2} textAlign="center" mb={3}>
            <Typography variant="h5" fontWeight={700}>
              Register Bank Officer
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter officer details and assign a bank
            </Typography>
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* Role badge */}
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={1}
            mb={3}
          >
            <Typography variant="body2" color="text.secondary">
              Role:
            </Typography>
            <Chip
              label="BANK OFFICER"
              color="success"
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Stack>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <TextField
                label="Full Name"
                placeholder="e.g. Ali Khan"
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
                fullWidth
              />
              <TextField
                label="Email Address"
                placeholder="e.g. officer@bank.com"
                type="email"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
              />
              <TextField
                label="Password"
                placeholder="Minimum 6 characters"
                type="password"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                fullWidth
              />

              <Controller
                name="bankId"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    label="Bank Code"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value as string;
                      const bank = banks?.find((b) => b.bankCode === value);
                      if (bank) field.onChange(bank._id);
                    }}
                    error={!!errors.bankId}
                    helperText={errors.bankId?.message}
                    fullWidth
                    InputProps={{
                      style: { color: "#000" }, // dropdown input text color
                    }}
                    SelectProps={{
                      MenuProps: {
                        PaperProps: {
                          style: { backgroundColor: "#fff", color: "#000" }, // menu background + text color
                        },
                      },
                    }}
                  >
                    {banks?.map((bank) => (
                      <MenuItem
                        key={bank._id}
                        value={bank.bankCode}
                        style={{ color: "#000" }} // menu item text color
                      >
                        {bank.bankCode}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Button
                type="submit"
                disabled={loading}
                size="large"
                variant="contained"
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontWeight: 600,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #0d9488, #2dd4bf)",
                }}
              >
                {loading ? (
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <CircularProgress size={18} color="inherit" />
                    <span>Registering…</span>
                  </Stack>
                ) : (
                  "Register Officer"
                )}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Box>
    </>
  );
};

export default BankOfficerRegisterForm;
