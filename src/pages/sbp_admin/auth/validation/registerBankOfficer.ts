import * as yup from "yup";

export const registerSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Minimum 6 characters").required(),
  bankId: yup.string().required("Bank is required"),
});
