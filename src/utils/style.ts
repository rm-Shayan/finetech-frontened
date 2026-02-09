  export const inputStyle = {
    "& .MuiOutlinedInput-root": {
      bgcolor: "#f0fdfa",
      borderRadius: 2.5,
      transition: "0.3s",
      "&:hover": { bgcolor: "#e0f7f4" },
      "&.Mui-focused": { bgcolor: "#fff" },
    },
  };

 export  const uploadBoxStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    p: 3,
    border: "2px dashed #14b8a6",
    borderRadius: 3,
    cursor: "pointer",
    transition: "all 0.3s ease",
    bgcolor: "#f0fdfa",
    color: "#0d9488",
    "&:hover": {
      bgcolor: "#ccfbf1",
      borderColor: "#0f766e",
      transform: "translateY(-2px)",
    },
    minHeight: 90,
    textAlign: "center" as const,
  };