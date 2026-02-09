import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { GlobalLoader } from "./components/loader";

import {
  UserRoute,
  BankOfficerRoute,
  AdminRoute,
} from "./pages/shared/components/WrapperRoute";
import AuthRoleWrapper from "./pages/shared/components/AuthRoleWrapper";
import NotFound from "./pages/shared/not-found";
import { Navigate } from "react-router-dom";

// Public Pages
const FinetechLandingPage = lazy(() => import("./pages/Public"));

// Auth Pages
const SignUp = lazy(() => import("./pages/auth/signup"));
const Login = lazy(() => import("./pages/auth/login"));
const ForgotPassword = lazy(() => import("./pages/auth/forgot-password"));
const ResetPassword = lazy(() => import("./pages/auth/reset-password"));
const SettingPage = lazy(
  () => import("./pages/shared/components/settings/settings"),
);

// Admin Auth
const AdminLogin = lazy(() => import("./pages/sbp_admin/auth/login"));
const AdminForgotPassword = lazy(
  () => import("./pages/sbp_admin/auth/forgot-password"),
);
const AdminResetPassword = lazy(
  () => import("./pages/sbp_admin/auth/reset-password"),
);

// Dashboard Layout
const DashboardLayout = lazy(
  () => import("./pages/shared/components/dashboardLayot"),
);
const ProfileLayout = lazy(
  () => import("./pages/shared/components/ProfileLayout/ProfileLayout"),
);
const UserDashboard = lazy(() => import("./pages/user/Dashboard/dashboard"));
const UserComplaints = lazy(() => import("./pages/user/Dashboard/complaints"));
const UserComplaintsAdd = lazy(
  () => import("./pages/user/Dashboard/complaintAdd"),
);
const UserComplaintDetail = lazy(
  () => import("./pages/user/Dashboard/ComplaintDetail"),
);
const UserRemarks=lazy(()=>import("./pages/user/Dashboard/remarks"))
const UserProfile = lazy(() => import("./pages/user/profile/profile"));
const UserUpdateProfile=lazy(()=>import("./pages/user/profile/UpdateProfile"))

//Admin Dasboard Pages

const AdminDashboard = lazy(
  () => import("./pages/sbp_admin/Dashboard/dashboard"),
);
const AdminComplaints = lazy(
  () => import("./pages/sbp_admin/Dashboard/complaint"),
);

const AdminComplaintDetail = lazy(
  () => import("./pages/sbp_admin/Dashboard/complaintDetail"),
);

const AdminUsersDashboard = lazy(
  () => import("./pages/sbp_admin/Dashboard/Users"),
);

const AdminRegisterPage = lazy(
  () => import("./pages/sbp_admin/Dashboard/registr-BankOfficer"),
);

const AdminProfile = lazy(() => import("./pages/sbp_admin/profile/profile"));
//bankOfficer  Dashboard  Pages
const BankOfficerDashboard = lazy(
  () => import("./pages/bankOfficer/Dashboard/dashboard"),
);

const BankOfficerComplaints = lazy(
  () => import("./pages/bankOfficer/Dashboard/complaint"),
);

const BankOfficerComplaintDetail = lazy(
  () => import("./pages/bankOfficer/Dashboard/ComplaintDetail"),
);

const BankOfficerGetUserspage = lazy(
  () => import("./pages/bankOfficer/Dashboard/user"),
);

const BankOfficerProfile = lazy(() => import("./pages/bankOfficer/profile/profile"));

const BanKofficerUpdateProfile=lazy(()=>import("./pages/bankOfficer/profile/updateProfile"))


const BankOfficerRemarks=lazy(()=>import("./pages/bankOfficer/Dashboard/remarks"))

// Unauthorized
const Unauthorized = lazy(
  () => import("./pages/shared/unauthorized/unauthorize"),
);

function App() {
  return (
    <Suspense fallback={<GlobalLoader open />}>
      <Routes>
        {/* 🌍 Public */}
        <Route path="/" element={<FinetechLandingPage />} />

        {/* ================= USER + BANK OFFICER AUTH PAGES (Public for login/signup) ================= */}
        <Route
          element={
            <AuthRoleWrapper allowedRoles={["customer", "bank_officer"]} />
          }
        >
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* ================= ADMIN AUTH PAGES (Public login pages) ================= */}
        <Route element={<AuthRoleWrapper allowedRoles={["sbp_admin"]} />}>
          <Route path="/admin">
            <Route path="login" element={<AdminLogin />} />
            <Route path="forgot-password" element={<AdminForgotPassword />} />
            <Route path="reset-password" element={<AdminResetPassword />} />
          </Route>
        </Route>

        {/* ================= USER DASHBOARD ================= */}
        <Route element={<UserRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="user" replace />} />
            <Route path="user">
              <Route index element={<UserDashboard />} />
              <Route path="settings" element={<SettingPage />} />

              <Route path="profile" element={<ProfileLayout />}>
                <Route path="view" element={<UserProfile />} />
                <Route path="update" element={<UserUpdateProfile />} />
              </Route>

              <Route path="complaints">
                <Route index element={<UserComplaints />} />
                <Route path="add" element={<UserComplaintsAdd />} />
                <Route path=":complaintId" element={<UserComplaintDetail />} />
                <Route path=":id/remarks" element={<UserRemarks />} />
              </Route>
            </Route>
          </Route>
        </Route>

        {/* ================= BANK OFFICER DASHBOARD ================= */}
     <Route element={<BankOfficerRoute />}>
  <Route path="/dashboard/bank" element={<DashboardLayout />}>
    <Route index element={<BankOfficerDashboard />} />
    <Route path="settings" element={<SettingPage />} />

    <Route path="complaints">
      <Route index element={<BankOfficerComplaints />} />
      <Route path=":complaintId" element={<BankOfficerComplaintDetail />} />
     <Route path=":id/remarks" element={<BankOfficerRemarks />} />
    </Route>

    <Route path="users">
      <Route index element={<BankOfficerGetUserspage />} />
    </Route>

    <Route path="profile" element={<ProfileLayout />}>
      <Route path="view" element={<BankOfficerProfile/>} />
      <Route path="update" element={<BanKofficerUpdateProfile/>} />
    </Route>
  </Route>
</Route>


        {/* ================= SBP ADMIN DASHBOARD (Protected) ================= */}
        <Route element={<AdminRoute />}>
          <Route path="/dashboard/admin" element={<DashboardLayout />}>
            {/* default /dashboard/admin */}
            <Route index element={<AdminDashboard />} />
            <Route path="settings" element={<SettingPage />} />
            {/* complaints */}
            <Route path="complaints">
              {/* /dashboard/admin/complaints */}
              <Route index element={<AdminComplaints />} />

              {/* /dashboard/admin/complaints/:complaintId */}
              <Route path=":complaintId" element={<AdminComplaintDetail />} />
            </Route>
            {/* users (future example) */}
            <Route path="users">
              <Route index element={<AdminUsersDashboard />} />
              <Route
                path="register-bank_oficer"
                element={<AdminRegisterPage />}
              />
            </Route>

            <Route path="profile" element={<ProfileLayout />}>
              <Route path="view" element={<AdminProfile />} />
            </Route>
          </Route>
        </Route>

        {/* 🚫 Unauthorized */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* ❌ 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
