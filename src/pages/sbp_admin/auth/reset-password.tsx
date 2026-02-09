import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Link,
  Fade,
  Stack,
} from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";

import type { AppDispatch } from "../../../store/store";
import { resetPasswordSchema } from "./validation/resetPasswordSchema";
import { sbpAdminResetPasswordThunk } from "../../../store/features/sbp_admin/thunk/sbp_admin.thunk";

interface ResetForm {
  password: string;
  confirmPassword: string;
}

const AdminResetPassword = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);

  const [params] = useSearchParams();
  const token = params.get("token") || "";

  /* ================= FORM ================= */
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

  /* ================= SUBMIT ================= */
  const onSubmit = (data: ResetForm) => {
    dispatch(
      sbpAdminResetPasswordThunk({
        token,
        newPassword: data.password,
      })
    )
      .unwrap()
      .then(() => {
        navigate("/admin/login");
      })
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
          {/* Heading */}
          <Fade in={fadeIn} timeout={1000}>
            <Typography variant="h4" fontWeight={900} color="primary">
              Finetech
            </Typography>
          </Fade>

          {/* Subtitle */}
          <Fade in={fadeIn} timeout={1200}>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              mb={3}
              fontWeight={500}
            >
              Reset Password — Enter your new password
            </Typography>
          </Fade>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <Fade in={fadeIn} timeout={1400}>
                <TextField
                  label="New Password"
                  type="password"
                  fullWidth
                  margin="normal"
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              </Fade>

              <Fade in={fadeIn} timeout={1600}>
                <TextField
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  margin="normal"
                  {...register("confirmPassword")}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />
              </Fade>

              <Fade in={fadeIn} timeout={1800}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ mt: 2 }}
                >
                  Reset Password
                </Button>
              </Fade>
            </Stack>
          </form>

          {/* Back to Login */}
          <Fade in={fadeIn} timeout={2000}>
            <Box mt={2} textAlign="center">
              <Link component="button" onClick={() => navigate("/admin/login")}>
                Back to Login
              </Link>
            </Box>
          </Fade>
        </Paper>
      </Fade>
    </Box>
  );
};

export default AdminResetPassword;
