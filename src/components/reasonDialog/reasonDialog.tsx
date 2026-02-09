import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";

type ReasonDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
};

const ReasonDialog = ({ open, onClose, onSubmit }: ReasonDialogProps) => {
  const [reason, setReason] = useState("");

  // dialog close hote hi input reset
  useEffect(() => {
    if (!open) setReason("");
  }, [open]);

  const handleSubmit = () => {
    const trimmed = reason.trim();
    if (!trimmed) return;
    onSubmit(trimmed); // ✅ ONLY STRING
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800 }}>
        Reason Required
      </DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          multiline
          minRows={4}
          placeholder="Enter reason here..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          disabled={!reason.trim()}
          onClick={handleSubmit}
        >
          Submit
        </Button>
        
      </DialogActions>
    </Dialog>
  );
};

export default ReasonDialog;
