import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Link,
  Fade,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";

import { forgotPasswordSchema } from "./validation/forgotpasswordSchema";
import { forgotPasswordThunk } from "../../store/features/user/thunk/user.thunk";
import { bankOfficerForgotPasswordThunk } from "../../store/features/bankOfficer/thunk/bankOfficer.thunk";
import type { AppDispatch } from "../../store/store";

interface ForgotForm {
  email: string;
}

interface Props {
  role?: "user" | "bank_officer";
}

const ForgotPassword = ({ role }: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [fadeIn, setFadeIn] = useState(false);

  const [searchParams] = useSearchParams();
  const targetRole =
    role || (searchParams.get("role") as "user" | "bank_officer") || "user";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const onSubmit = (data: ForgotForm) => {
    const email = data.email; // ✅ Extract string
    if (targetRole === "bank_officer") {
      dispatch(bankOfficerForgotPasswordThunk(email))
        .unwrap()
        .then(() => alert("Bank Officer reset link sent!"))
        .catch((err) => alert(err));
    } else {
      dispatch(forgotPasswordThunk(email))
        .unwrap()
        .then(() => alert("User reset link sent!"))
        .catch((err) => alert(err));
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
            {targetRole === "bank_officer" ? "Bank Officer" : "User"} Forgot Password
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" mb={3}>
            Enter your registered email to receive the reset link
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 3, py: 1.5, borderRadius: 2 }}
            >
              Send Reset Link
            </Button>
          </form>

          <Box mt={2} textAlign="center">
            <Link
              component="button"
              onClick={() =>
                navigate(`/login?role=${targetRole}`)
              }
            >
              Back to Login
            </Link>
          </Box>

          {/* Animated Background Circles */}
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

export default ForgotPassword;
