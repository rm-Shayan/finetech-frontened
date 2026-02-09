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
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { sbpAdminForgotPasswordThunk } from "../../../store/features/sbp_admin/thunk/sbp_admin.thunk";
import { forgotPasswordSchema } from "./validation/forgotpasswordSchema";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store/store";

interface ForgotForm {
  email: string;
}

const ForgotPassword = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  const [fadeIn, setFadeIn] = useState(false);

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
  const email=data.email;
  
  dispatch(sbpAdminForgotPasswordThunk(email))
    .unwrap()
    .then(() => {
      console.log("Reset link sent successfully");
      navigate("/admin/login"); // redirect admin login
    })
    .catch(err => {
      console.error("Error sending reset link:", err);
    });
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
          <Fade in={fadeIn} timeout={1000}>
            <Typography variant="h4" fontWeight={900} color="primary">
              Finetech
            </Typography>
          </Fade>

          <Fade in={fadeIn} timeout={1200}>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              mb={3}
              fontWeight={500}
            >
              Forgot Password — Enter your email to reset
            </Typography>
          </Fade>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <Fade in={fadeIn} timeout={1400}>
                <TextField
                  label="Email"
                  fullWidth
                  margin="normal"
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Fade>

              <Fade in={fadeIn} timeout={1600}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ mt: 2 }}
                >
                  Send Reset Link
                </Button>
              </Fade>
            </Stack>
          </form>

          <Fade in={fadeIn} timeout={1800}>
            <Box mt={2} textAlign="center">
              <Link component="button" onClick={() => navigate("/login")}>
                Back to Login
              </Link>
            </Box>
          </Fade>
        </Paper>
      </Fade>
    </Box>
  );
};

export default ForgotPassword;
