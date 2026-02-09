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
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";

import { loginSchema } from "./validation/loginSchema";
import type { AppDispatch } from "../../../store/store";
import {sbpAdminLoginThunk  } from "../../../store/features/sbp_admin/thunk/sbp_admin.thunk";

interface LoginForm {
  email: string;
  password: string;
}

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [fadeIn, setFadeIn] = useState(false);




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
    dispatch(sbpAdminLoginThunk(data))
      .unwrap()
      .then(() => navigate("/dashboard/admin"))
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
            SBP Admin Login — Authorized personnel only
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
                navigate(`/admin/forgot-password`)
              }
            >
              Forgot password?
            </Link>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

export default AdminLogin;
