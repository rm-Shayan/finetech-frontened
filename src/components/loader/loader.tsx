import { Backdrop, CircularProgress } from "@mui/material";

export const GlobalLoader = ({ open }: { open: boolean }) => {
  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 10,
        backdropFilter: "blur(3px)",
        backgroundColor: "rgba(0,0,0,0.35)",
      }}
    >
      <CircularProgress size={42} thickness={4} />
    </Backdrop>
  );
};
