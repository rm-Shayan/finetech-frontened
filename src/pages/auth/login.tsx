import { useEffect, useMemo, useState } from "react";
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

import { loginSchema } from "./validation/loginSchema";
import type { AppDispatch } from "../../store/store";
import { loginThunk } from "../../store/features/user/thunk/user.thunk";
import { bankOfficerLoginThunk } from "../../store/features/bankOfficer/thunk/bankOfficer.thunk";

type Role = "user" | "bank_officer";

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [fadeIn, setFadeIn] = useState(false);
  const [searchParams] = useSearchParams();

  /* ================= ROLE LOGIC ================= */
  const targetRole: Role = useMemo(() => {
    return searchParams.get("role") === "bank_officer"
      ? "bank_officer"
      : "user";
  }, [searchParams]);

  /* ================= FORM ================= */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(loginSchema),
  });

  useEffect(() => {
    setFadeIn(true);
  }, []);

  /* ================= SUBMIT ================= */
  const onSubmit = (data: LoginForm) => {
    const action =
      targetRole === "bank_officer"
        ? bankOfficerLoginThunk
        : loginThunk;

    const redirectPath =
      targetRole === "bank_officer"
        ? "/dashboard/bank"
        : "/dashboard/user";

    dispatch(action(data))
      .unwrap()
      .then(() =>navigate(redirectPath))
      .catch(console.error);
  };
  /* ================= UI ================= */
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
      <Fade in={fadeIn} timeout={800}>
        <Paper
          elevation={10}
          sx={{
            width: { xs: "100%", sm: 400 },
            p: 4,
            borderRadius: 3,
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Typography variant="h4" fontWeight={900} color="primary">
            Finetech
          </Typography>

          <Typography
            variant="subtitle1"
            color="text.secondary"
            mb={3}
            fontWeight={500}
          >
           
            {targetRole === "bank_officer"
              ? "Bank Officer Login"
              : "Secure Login to Report Banking Fraud"}
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 3 }}
            >
              Login
            </Button>
          </form>

          <Box mt={2} display="flex" justifyContent="space-between">
            <Link
              component="button"
              onClick={() =>
                navigate(`/forgot-password?role=${targetRole}`)
              }
            >
              Forgot password?
            </Link>

            <Button
              size="small"
              disabled={targetRole === "bank_officer"}
              onClick={() => navigate("/signup")}
            >
              Create account
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

export default Login;
