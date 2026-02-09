import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Paper,
  Fade,
  Link,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import type { RootState, AppDispatch } from "../../store/store";
import { getBanksThunk } from "../../store/features/bank/thunk/bankthunk";
import { signupThunk } from "../../store/features/user/thunk/user.thunk";
import { signupSchema } from "./validation/signupSchema";

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  bankId: string;
}

const SignUp = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);

  // 🔥 NEW: submit state
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { banks, loading } = useSelector(
    (state: RootState) => state.banks
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: yupResolver(signupSchema),
  });

  useEffect(() => {
    dispatch(getBanksThunk());
    setFadeIn(true);
  }, [dispatch]);

  /* ================= SUBMIT ================= */
  const onSubmit = (data: SignUpFormData) => {
    setIsSubmitting(true);

    dispatch(signupThunk(data))
      .unwrap()
      .then(() => {
        // ✅ success → login page
        alert("account Created Succesfully")
        navigate("/login");
      })
      .catch((err) => {
        console.error("Signup failed:", err);
        setIsSubmitting(false); // ❌ error → re-enable button
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
            width: { xs: "100%", sm: 420 },
            p: 4,
            borderRadius: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="h4" fontWeight={900} color="primary">
            Finetech
          </Typography>

          <Typography variant="subtitle1" color="text.secondary" mb={3}>
            Register to report banking fraud safely
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Name"
              margin="normal"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            <TextField
              fullWidth
              label="Email"
              margin="normal"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              fullWidth
              type="password"
              label="Password"
              margin="normal"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <TextField
              fullWidth
              select
              label="Select Bank"
              margin="normal"
              {...register("bankId")}
              error={!!errors.bankId}
              helperText={errors.bankId?.message}
            >
              {loading && <MenuItem disabled>Loading banks...</MenuItem>}
              {banks?.map((bank: any) => (
                <MenuItem key={bank._id} value={bank._id}>
                  {bank.bankName}
                </MenuItem>
              ))}
            </TextField>

            {/* 🔥 BUTTON DISABLED AFTER CLICK */}
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{ mt: 3, py: 1.5 }}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* Login link */}
          <Box mt={2}>
            <Typography variant="body2">
              Already have an account?{" "}
              <Link
                component="button"
                onClick={() => navigate("/login")}
                sx={{ fontWeight: 600 }}
              >
                Login
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

export default SignUp;
