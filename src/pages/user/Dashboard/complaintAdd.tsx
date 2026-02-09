import React from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Paper,
  Stack,
  Chip,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  ArrowBack as BackIcon,
  Description as FormIcon,
} from "@mui/icons-material";
import { useForm, } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useSubmitComplaint } from "../../../Hooks/useSubmitComplaintHook";
import { useSelector } from "react-redux";

import {
  TEAL_GRADIENT,
  MAX_ATTACHMENTS,
  COMPLAINT_CATEGORIES,
  COMPLAINT_TYPES,
  PRIORITIES,
} from "../../../utils/constants";
import { inputStyle, uploadBoxStyle } from "../../../utils/style";
import {
  type ComplaintFormValues,
  complaintSchema,
} from "./validation/complaint.validation";
import type { RootState } from "../../../store/store";

const AddComplaint = () => {
  const navigate = useNavigate();
  const {loading}=useSelector((state:RootState)=>state.userComplaints)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ComplaintFormValues>({
    resolver: yupResolver(complaintSchema) as any,
    defaultValues: {
      type: "", // MUI select expects '' or a valid option
      category: "",
      priority: "",
      description: "",
      pdf: undefined,
      attachments: [],
    },
  });

  const watchedAttachments = watch("attachments");
  const watchedPDF = watch("pdf");
  const watchedDescription = watch("description");

  const {onSubmit}=useSubmitComplaint()
  // ----------- Handle Image Upload -----------
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files ? Array.from(e.target.files) : [];
    if (!newFiles.length) return;

    const currentFiles = watchedAttachments ?? [];
    const mergedFiles = [...currentFiles, ...newFiles].slice(
      0,
      MAX_ATTACHMENTS,
    );

    setValue("attachments", mergedFiles, { shouldValidate: true });
    e.target.value = "";
  };



  return (
    <Box sx={{ pb: 6 }}>
      {/* Header */}
      <Box
        sx={{
          background: TEAL_GRADIENT,
          pt: 4,
          pb: 8,
          px: 2,
          color: "#fff",
          textAlign: "center",
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={1}
        >
          <FormIcon />
          <Typography variant="h4" fontWeight={700}>
            File a Complaint
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
          Fill the form with accurate information to resolve your issue quickly.
        </Typography>
      </Box>

      {/* Form */}
      <Box sx={{ maxWidth: 700, mx: "auto", mt: -6, px: 2 }}>
        <Paper
          elevation={10}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 5,
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          }}
        >
         <form onSubmit={handleSubmit(onSubmit)} noValidate>
  <Stack spacing={3}>
    {/* Type & Priority */}
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
      <TextField
        select
        label="Complaint Type"
        fullWidth
        defaultValue=""
        {...register("type")}
        error={!!errors.type}
        helperText={errors.type?.message}
        sx={inputStyle}
      >
        {COMPLAINT_TYPES.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Priority Level"
        fullWidth
        defaultValue=""
        {...register("priority")}
        error={!!errors.priority}
        helperText={errors.priority?.message}
        sx={inputStyle}
      >
        {PRIORITIES.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>
    </Stack>

    {/* Category */}
    <TextField
      select
      label="Category / Subject"
      fullWidth
      defaultValue=""
      {...register("category")}
      error={!!errors.category}
      helperText={errors.category?.message}
      sx={inputStyle}
    >
      {COMPLAINT_CATEGORIES.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </TextField>

    {/* Description */}
    <TextField
      label="Detailed Description"
      fullWidth
      multiline
      rows={4}
      placeholder="Explain your issue..."
      {...register("description")}
      error={!!errors.description}
      helperText={
        errors.description
          ? errors.description.message
          : "Optional if PDF uploaded (min 20 chars if provided)"
      }
      sx={inputStyle}
    />

    {/* Attachments */}
    <Box>
      <Typography variant="subtitle2" fontWeight={700} color="text.secondary" mb={1.5}>
        Attachments
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        {/* PDF */}
        <Box flex={1}>
          <input
            type="file"
            id="pdf-upload"
            accept="application/pdf"
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files)
                setValue("pdf", e.target.files, { shouldValidate: true });
            }}
          />
          <label htmlFor="pdf-upload">
            <Box sx={uploadBoxStyle}>
              <UploadIcon sx={{ mb: 1 }} />
              <Typography variant="caption" fontWeight={700}>
                UPLOAD PDF
                {watchedDescription && " (Optional, description provided)"}
              </Typography>
              {watchedPDF &&
                (() => {
                  const pdfArray: File[] =
                    watchedPDF instanceof FileList ? Array.from(watchedPDF) : (watchedPDF as File[]);
                  if (pdfArray.length === 0) return null;
                  return <Typography variant="caption">{pdfArray[0].name}</Typography>;
                })()}
            </Box>
          </label>
        </Box>

        {/* Images */}
        <Box flex={1}>
          <input
            type="file"
            id="img-upload"
            multiple
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          <label htmlFor="img-upload">
            <Box sx={uploadBoxStyle}>
              <UploadIcon sx={{ mb: 1 }} />
              <Typography variant="caption" fontWeight={700}>
                ATTACH IMAGES (Max {MAX_ATTACHMENTS}) — optional
              </Typography>
              {watchedAttachments &&
                Array.from(
                  watchedAttachments instanceof FileList ? watchedAttachments : (watchedAttachments as File[])
                ).map((file, i) => (
                  <Chip key={i} label={file.name} size="small" />
                ))}
            </Box>
          </label>
        </Box>
      </Stack>
    </Box>

    {/* Submit */}
    <Button
      type="submit"
      variant="contained"
      fullWidth
      disabled={loading}
      sx={{ py: 1.8, borderRadius: 3, fontWeight: 800, fontSize: "1rem", background: TEAL_GRADIENT }}
    >
      Submit Complaint
    </Button>

    {/* Cancel */}
    <Button
      startIcon={<BackIcon />}
      onClick={() => navigate(-1)}
      sx={{ color: "text.secondary", textTransform: "none", fontWeight: 600 }}
    >
      Cancel and Go Back
    </Button>
  </Stack>
</form>
        </Paper>
      </Box>
    </Box>
  );
};

export default AddComplaint;
