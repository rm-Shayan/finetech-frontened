import { AlertService } from "./service/alert.service";
import { type AppDispatch } from "../store/store";
import {
  closeComplaintThunk,
  updateComplaintThunk,
  deleteComplaintThunk,
} from "../store/features/user/thunk/complaint.thunk";
import { updateComplaintStatusThunk } from "../store/features/bankOfficer/thunk/bankOfficerComplaintThunk";
import { useNavigate } from "react-router-dom";
import { refreshTokenThunk } from "../store/features/user/thunk/user.thunk";
import { bankOfficerRefreshThunk } from "../store/features/bankOfficer/thunk/bankOfficer.thunk";
import { updatePasswordThunk,updateUserThunk } from "../store/features/user/thunk/user.thunk";
import { bankOfficerUpdatePasswordThunk,bankOfficerUpdateThunk } from "../store/features/bankOfficer/thunk/bankOfficer.thunk";
import { sbpAdminUpdateThunk,sbpAdminUpdatePasswordThunk } from "../store/features/sbp_admin/thunk/sbp_admin.thunk";
import { getRemarksThunk } from "../store/features/user/thunk/remark.thunk";
import { getBankOfficerRemarksThunk } from "../store/features/bankOfficer/thunk/bankOfficerRemark.thunk";

type UserRole = "customer" | "bank_officer" | "sbp_admin";

interface UpdateUserParams {
  role: UserRole;
  dispatch: AppDispatch;
  navigate: ReturnType<typeof useNavigate>;
  name?: string;
  email?: string;
  avatar?: File | null;
}

interface UpdatePasswordParams {
  role: UserRole;
  dispatch: AppDispatch;
  navigate: ReturnType<typeof useNavigate>;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface FetchRemarksParams {
  dispatch: AppDispatch;
  complaintId?: string;
  complaintNo?: string;
  status?: string;
  setLoading?: (val: boolean) => void;
  role?:UserRole,
}


// Update Handl
// er
export const handleUpdate = async (
  dispatch: AppDispatch,
  complaintId: string,
  description: string,
  selectedFiles: File[],
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const confirm = await AlertService.confirm(
    "Save changes?",
    "Do you want to update the description or attachments?",
  );
  if (!confirm.isConfirmed) return;

  const tryUpdate = async () => {
    try {
      // Build FormData
      const formData = new FormData();
      if (description.trim())
        formData.append("description", description.trim());

      if (selectedFiles)
        selectedFiles.forEach((file) => formData.append("attachments", file));

      // Dispatch update
      await dispatch(updateComplaintThunk({ id: complaintId, data: formData }));

      setIsEditing(false);
      AlertService.success("Updated!", "Your complaint has been updated.");
    } catch (error: any) {
      console.error(error);

      // Retry once on 401 Unauthorized
      if (error?.response?.status === 401) {
        await dispatch(refreshTokenThunk()).unwrap();
        await tryUpdate(); // retry after refresh
      } else {
        AlertService.error(
          "Error",
          error?.message || "Update failed. Please try again.",
        );
      }
    }
  };

  await tryUpdate();
};

// Delete Handler
export const handleDelete = async (
  complaintId: string,
  dispatch: AppDispatch,
  navigate?: ReturnType<typeof useNavigate>,
) => {
  const confirm = await AlertService.confirm(
    "Are you sure?",
    "This will permanently delete your complaint!",
    "warning",
  );
  if (!confirm.isConfirmed) return;

  const tryDelete = async () => {
    try {
      await dispatch(deleteComplaintThunk(complaintId)).unwrap();
      AlertService.success("Deleted!", "Complaint removed successfully.");
      navigate &&
        navigate(`${import.meta.env.VITE_FRONT_URL}/dashboard/user/complaints`);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        await dispatch(refreshTokenThunk()).unwrap();
        await tryDelete();
      } else {
        AlertService.error(
          "Error",
          error?.message || "Delete failed. Please try again.",
        );
      }
    }
  };

  await tryDelete();
};

// Status Update (Close/Resolve etc.)
export const handleStatusUpdate = async (
  complaintId: string,
  nextStatus: string,
  prevStatus: string,
  dispatch: AppDispatch,
  reason: string,
  role: UserRole,
  navigate: ReturnType<typeof useNavigate>, // <- pass karo component se
) => {
  const { isConfirmed } = await AlertService.confirm(
    "Update Status?",
    `Are you sure you want to change status from ${prevStatus.toUpperCase()} to ${nextStatus.toUpperCase()}?`,
    "warning",
  );

  if (!isConfirmed) return;

  const basePayload = { id: complaintId, reason };

  try {
    let result;

    // 🔥 Role-based dispatch
    if (role === "customer") {
      result = await dispatch(closeComplaintThunk(basePayload) as any);
    } else {
      result = await dispatch(
        updateComplaintStatusThunk({
          ...basePayload,
          status: nextStatus,
        }) as any,
      );
    }

    // ✅ Check if dispatch fulfilled
    if (result.meta.requestStatus === "fulfilled") {
      AlertService.success(
        "Status Updated!",
        role === "customer"
          ? "Complaint closed successfully."
          : `Complaint is now ${nextStatus}.`,
      );
      if (role == "customer")
        navigate(`${import.meta.env.VITE_FRONT_URL}/dashboard/user/complaints`);

      navigate(`${import.meta.env.VITE_FRONT_URL}/dashboard/bank/complaints`);
    } else {
      throw new Error(result.error?.message || "Failed to update status");
    }
  } catch (error: any) {
    // 🔄 Handle token expiry (401 / Unauthorized)
    if (error?.status === 401 || error?.message === "Unauthorized") {
      AlertService.success(
        "Session Expired",
        "Refreshing session, please wait...",
      );

      try {
        // Role-based refresh
        if (role === "customer") {
          await dispatch(refreshTokenThunk()).unwrap();
        } else {
          await dispatch(bankOfficerRefreshThunk()).unwrap();
        }

        // Retry status update after refresh
        let retryResult;
        if (role === "customer") {
          retryResult = await dispatch(closeComplaintThunk(basePayload) as any);
        } else {
          retryResult = await dispatch(
            updateComplaintStatusThunk({
              ...basePayload,
              status: nextStatus,
            }) as any,
          );
        }

        if (retryResult.meta.requestStatus === "fulfilled") {
          AlertService.success(
            "Status Updated!",
            role === "customer"
              ? "Complaint closed successfully."
              : `Complaint is now ${nextStatus}.`,
          );
          if (role == "customer")
            navigate(
              `${import.meta.env.VITE_FRONT_URL}/user/dashboard/complaints`,
            );

          navigate(
            `${import.meta.env.VITE_FRONT_URL}/${role}/dashboard/complaints`,
          );
        } else {
          AlertService.error(
            "Status Update Failed",
            retryResult.error?.message || "Something went wrong after refresh!",
          );
        }
      } catch (refreshError: any) {
        AlertService.error(
          "Status Update Failed",
          refreshError?.message ||
            "Unable to refresh session. Please login again.",
        );
      }
    } else {
      AlertService.error(
        "Status Update Failed",
        error?.message || "Unexpected error!",
      );
    }
  }
};

export const isReasonRequired = (
  prevStatus: string,
  nextStatus: string,
  role: UserRole,
) => {
  // ✅ customer hamesha reason ke sath close karega
  if (role === "customer") return true;

  // ✅ officer rules
  if (nextStatus === "rejected" || nextStatus === "escalated") return true;

  if (
    nextStatus === "resolved" &&
    (prevStatus === "rejected" || prevStatus === "escalated" || prevStatus ==="other")
  ) {
    return true;
  }

  return false;
};

export const handleUserUpdate = async ({
  role,
  dispatch,
  navigate,
  name,
  email,
  avatar,
}: UpdateUserParams) => {
  const formData = new FormData();
  if (name) formData.append("name", name);
  if (email) formData.append("email", email);
  if (avatar) formData.append("avatar", avatar);

  const tryUpdate = async () => {
    try {
      if (role === "customer") await dispatch(updateUserThunk(formData)).unwrap();
      else if (role === "bank_officer")
        await dispatch(bankOfficerUpdateThunk(formData)).unwrap();
      else if (role === "sbp_admin")
        await dispatch(sbpAdminUpdateThunk(formData)).unwrap();

      AlertService.success("Success", "Profile updated successfully!");
    } catch (err: any) {
      if (err?.statusCode === 401) {
        // Role-based refresh
        try {
          if (role === "customer") await dispatch(refreshTokenThunk()).unwrap();
          else if (role === "bank_officer") await dispatch(bankOfficerRefreshThunk()).unwrap();

          await tryUpdate(); // Retry update after refresh
        } catch {
          AlertService.error("Session Expired", "Please login again");
          navigate("/login");
        }
      } else {
        AlertService.error("Error", err?.message || "Failed to update profile");
      }
    }
  };

  await tryUpdate();
};

// Role-based Password Update
export const handlePasswordUpdate = async ({
  role,
  dispatch,
  navigate,
  currentPassword,
  newPassword,
  confirmPassword,
}: UpdatePasswordParams) => {
  if (newPassword !== confirmPassword) {
    return AlertService.error("Error", "Passwords do not match!");
  }

  const tryUpdatePassword = async () => {
    try {
      if (role === "customer")
        await dispatch(updatePasswordThunk({ currentPassword, newPassword })).unwrap();
      else if (role === "bank_officer")
        await dispatch(bankOfficerUpdatePasswordThunk({ currentPassword, newPassword })).unwrap();
      else if (role === "sbp_admin")
        await dispatch(sbpAdminUpdatePasswordThunk({ currentPassword, newPassword })).unwrap();

      AlertService.success("Success", "Password updated successfully!");
    } catch (err: any) {
      if (err?.statusCode === 401) {
        try {
          if (role === "customer") await dispatch(refreshTokenThunk()).unwrap();
          else if (role === "bank_officer") await dispatch(bankOfficerRefreshThunk()).unwrap()
          await tryUpdatePassword(); // Retry password update
        } catch {
          AlertService.error("Session Expired", "Please login again");
          navigate("/login");
        }
      } else {
        AlertService.error("Error", err?.message || "Failed to update password");
      }
    }
  };

  await tryUpdatePassword();
};


export const fetchRemarks = async ({
  dispatch,
  complaintId,
  complaintNo,
  status,
  setLoading,
  role = "customer",
}: FetchRemarksParams) => {
  if (!complaintId && !complaintNo) return null;

  if (setLoading) setLoading(true);

  const fetchThunk = role === "customer" ? getRemarksThunk : getBankOfficerRemarksThunk;
  const refreshThunk = role === "customer" ? refreshTokenThunk : bankOfficerRefreshThunk;

  try {
    // First attempt
    const result = await dispatch(fetchThunk({ complaintId, complaintNo, status })).unwrap();
    return result;
  } catch (error: any) {
    if (error?.statusCode === 401) {
      try {
        // Refresh token & retry
        await dispatch(refreshThunk()).unwrap();
        const result = await dispatch(fetchThunk({ complaintId, complaintNo, status })).unwrap();
        return result;
      } catch (e) {
        console.error("Failed to refresh token or fetch remarks:", e);
        return null;
      }
    } else {
      console.error("Unhandled error fetching remarks:", error);
      return null;
    }
  } finally {
    if (setLoading) setLoading(false);
  }
};
