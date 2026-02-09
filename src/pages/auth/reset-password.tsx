import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Fade,
} from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";

import { resetPasswordSchema } from "./validation/resetPasswordSchema";
import { resetPasswordThunk, type ResetPasswordPayload } from "../../store/features/user/thunk/user.thunk";
import { bankOfficerResetPasswordThunk } from "../../store/features/bankOfficer/thunk/bankOfficer.thunk";
import type { AppDispatch } from "../../store/store";

// ✅ Form interface
interface ResetForm {
  password: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [fadeIn, setFadeIn] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const targetRole = (searchParams.get("role") as "user" | "bank_officer") || "user";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetForm>({
    resolver: yupResolver(resetPasswordSchema),
  });

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const onSubmit = (data: ResetForm) => {
    const payload: ResetPasswordPayload = {
      token,
      newPassword: data.password,
    };

    if (targetRole === "bank_officer") {
      dispatch(bankOfficerResetPasswordThunk(payload))
        .unwrap()
        .then(() => {
          alert("Bank Officer password reset successful!");
          navigate("/login?role=bank_officer");
        })
        .catch((err: any) => alert(err));
    } else {
      dispatch(resetPasswordThunk(payload))
        .unwrap()
        .then(() => {
          alert("User password reset successful!");
          navigate("/login?role=user");
        })
        .catch((err: any) => alert(err));
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
        px: 2,
      }}
    >
      <Fade in={fadeIn} timeout={1000}>
        <Paper
          elevation={10}
          sx={{
            width: { xs: "100%", sm: 400 },
            p: 4,
            borderRadius: 3,
            position: "relative",
            textAlign: "center",
            overflow: "hidden",
          }}
        >
          <Typography variant="h4" fontWeight={900} color="primary" gutterBottom>
            {targetRole === "bank_officer" ? "Bank Officer" : "User"} Reset Password
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" mb={3}>
            Enter your new password below
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="New Password"
              type="password"
              fullWidth
              margin="normal"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              margin="normal"
              {...register("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 3, py: 1.5, borderRadius: 2 }}
            >
              Reset Password
            </Button>
          </form>

          {/* Animated Circles */}
          <Box
            sx={{
              position: "absolute",
              width: 120,
              height: 120,
              borderRadius: "50%",
              bgcolor: "primary.light",
              opacity: 0.15,
              top: -30,
              right: -30,
              animation: "float 6s ease-in-out infinite",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: "secondary.light",
              opacity: 0.2,
              bottom: -20,
              left: -20,
              animation: "float 8s ease-in-out infinite",
            }}
          />

          <style>
            {`
              @keyframes float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-15px); }
                100% { transform: translateY(0px); }
              }
            `}
          </style>
        </Paper>
      </Fade>
    </Box>
  );
};

export default ResetPassword;
