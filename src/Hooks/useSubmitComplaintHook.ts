import { type ComplaintFormValues } from "../pages/user/Dashboard/validation/complaint.validation";
import { type SubmitHandler } from "react-hook-form";
import { useDispatch } from "react-redux";
import { submitComplaintThunk } from "../store/features/user/thunk/complaint.thunk";
import type { AppDispatch } from "../store/store";
import { refreshTokenThunk } from "../store/features/user/thunk/user.thunk";
import { AlertService } from "../utils/service/alert.service";



export const useSubmitComplaint = () => {
  const dispatch = useDispatch<AppDispatch>();

 const onSubmit: SubmitHandler<ComplaintFormValues> = async (data) => {
 let formData = new FormData();
  try {
    // Prepare FormData
   formData.append("type", data.type);
    formData.append("category", data.category);
    formData.append("priority", data.priority);

    if (data.description?.trim()) {
      formData.append("description", data.description);
    }

    if (data.pdf) {
      const pdfFile =
        data.pdf instanceof FileList ? data.pdf[0] : (data.pdf as File);
      if (pdfFile) formData.append("pdf", pdfFile);
    }

    if (data.attachments?.length) {
      const files =
        data.attachments instanceof FileList
          ? Array.from(data.attachments)
          : (data.attachments as File[]);
      files.forEach((file) => formData.append("attachments", file));
    }

    // Submit complaint
    await dispatch(submitComplaintThunk(formData)).unwrap();
    AlertService.success(
      "Complaint Submitted!",
      "Your complaint has been submitted successfully."
    );
  } catch (error: any) {
    // Handle 401 token refresh
    if (error?.status === 401 || error?.message === "Unauthorized") {
      try {
        await dispatch(refreshTokenThunk()).unwrap();
        // Use the same formData variable
        await dispatch(submitComplaintThunk(formData as any));

        AlertService.success(
          "Complaint Submitted!",
          "Submitted successfully after refreshing session."
        );
      } catch (refreshError: any) {
        AlertService.error(
          "Submission Failed",
          refreshError?.message || "Unable to refresh session. Please login again."
        );
      }
    } else {
      AlertService.error(
        "Submission Failed",
        error?.message || "Something went wrong while submitting your complaint."
      );
    }
  }
};

  return { onSubmit };
};
