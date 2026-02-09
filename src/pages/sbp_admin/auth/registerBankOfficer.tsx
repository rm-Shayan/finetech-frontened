import { useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";

import type { RootState, AppDispatch } from "../../../store/store";
import { getBanksThunk } from "../../../store/features/bank/thunk/bankthunk";
import { signupThunk } from "../../../store/features/user/thunk/user.thunk";
import { registerSchema } from "./validation/registerBankOfficer";

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  bankId: string;
}

const SignUp = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { banks, loading } = useSelector(
    (state: RootState) => state?.banks
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: yupResolver(registerSchema),
  });

  // 🔹 Component mount hote hi banks load honge
  useEffect(() => {
    dispatch(getBanksThunk());
  }, [dispatch]);

  const onSubmit = (data: SignUpFormData) => {
    /**
     * data = {
     *  name,
     *  email,
     *  password,
     *  bankId  // <-- yahan BANK KI ID jayegi
     * }
     */
    dispatch(signupThunk(data));
  };

  return (
    <Box
      sx={{
        maxWidth: 420,
        mx: "auto",
        mt: 6,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" mb={2} textAlign="center">
        Sign Up
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Name */}
        <TextField
          fullWidth
          label="Name"
          margin="normal"
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        {/* Email */}
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        {/* Password */}
        <TextField
          fullWidth
          type="password"
          label="Password"
          margin="normal"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        {/* Bank Select */}
        <TextField
          fullWidth
          select
          label="Select Bank"
          margin="normal"
          {...register("bankId")}
          error={!!errors.bankId}
          helperText={errors.bankId?.message}
        >
          {loading && (
            <MenuItem disabled>Loading banks...</MenuItem>
          )}

          {banks?.map((bank: any) => (
            <MenuItem key={bank._id} value={bank._id}>
              {bank.bankName}
            </MenuItem>
          ))}
        </TextField>

        <Button
          fullWidth
          type="submit"
          variant="contained"
          sx={{ mt: 2 }}
        >
          Create Account
        </Button>
      </form>
    </Box>
  );
};

export default SignUp;