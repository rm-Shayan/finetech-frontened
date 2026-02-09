import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import type { RootState, AppDispatch } from "../../../store/store";
import { Box, Stack, Typography, Chip, Card, CardContent } from "@mui/material";
import { motion } from "framer-motion";
import { fetchRemarks } from "../../../utils/fun";

const RemarksView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id: complaintId } = useParams<{ id: string }>();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const complaintNo = query.get("complaintNo") || undefined;
  const status = query.get("status") || undefined;

  const {
    remarks,
    totalRemarks,
    complaintNo: cNo,
    currentStatus,
  } = useSelector((state: RootState) => state.userRemarks);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
     await fetchRemarks({
        dispatch,
        complaintId,
        complaintNo,
        status,
        setLoading,
        role: "customer",
      });
      // console.log("Remarks:", data);
    };
    load();
  }, [dispatch, complaintId, complaintNo, status]);

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mt: 4 }}>
        Remarks for Complaint: {cNo || complaintId}
      </Typography>
      <Typography variant="subtitle2" sx={{ mb: 3, color: "text.secondary" }}>
        Current Status:{" "}
        {currentStatus?.replace("_", " ").toUpperCase() || "N/A"} | Total
        Remarks: {totalRemarks || 0}
      </Typography>

      {loading && <Typography>Loading remarks...</Typography>}

      <Stack spacing={2.5}>
        {!loading && remarks?.length === 0 && (
          <Typography color="text.secondary">
            No remarks found for this complaint.
          </Typography>
        )}

        {remarks?.map((r, idx) => (
          <motion.div
            key={`${r._id}-${idx}`} // <-- unique key guaranteed
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            <Card
              sx={{
                borderRadius: 3,
                border: "1px solid #e2e8f0",
                background:
                  "linear-gradient(to right, #0f766e, #14b8a6, #5eead4)",
                color: "#fff",
                "&:hover": {
                  boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                },
              }}
            >
              <CardContent>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Action By: {r?.actionBy || "user"}
                    </Typography>
                    <Chip
                      label={r.actionType.replace("_", " ").toUpperCase()}
                      size="small"
                      sx={{
                        mt: 1,
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: "0.7rem",
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {r?.reason || "-"}
                    </Typography>
                  </Box>

                  <Typography
                    variant="caption"
                    sx={{
                      mt: { xs: 1, sm: 0 },
                      color: "rgba(255,255,255,0.9)",
                      fontWeight: 600,
                      minWidth: 120,
                      textAlign: { xs: "left", sm: "right" },
                    }}
                  >
                    {new Date(r.createdAt).toLocaleString()}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Stack>
    </Box>
  );
};

export default RemarksView;
