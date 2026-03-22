import { useState } from "react";
import {
  Box, TextField, Button, Grid, Typography, Paper, Divider, MenuItem,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

const defaultValues = {
  LIMIT_BAL: "", AGE: "",
  PAY_1: "", PAY_2: "", PAY_3: "",
  BILL_AMT1: "", PAY_AMT1: "", PAY_AMT2: "",
};



const fieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    bgcolor: "rgba(255,255,255,0.03)",
    "& fieldset": { borderColor: "rgba(148,163,184,0.2)" },
    "&:hover fieldset": { borderColor: "#818cf8" },
    "&.Mui-focused fieldset": { borderColor: "#818cf8" },
  },
  "& .MuiInputLabel-root": { color: "#94a3b8" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#818cf8" },
  "& input, & .MuiSelect-select": { color: "#f1f5f9" },
};

function SectionTitle({ children }) {
  return (
    <Typography
      variant="overline"
      sx={{ color: "#818cf8", fontWeight: 700, letterSpacing: 2, mb: 1, display: "block" }}
    >
      {children}
    </Typography>
  );
}

export default function PredictionForm({ onSubmit, loading }) {
  const [form, setForm] = useState(defaultValues);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericForm = {};
    for (const key of Object.keys(form)) {
      numericForm[key] = Number(form[key]);
    }
    onSubmit(numericForm);
  };

  const handleReset = () => setForm(defaultValues);

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 4,
        bgcolor: "rgba(15,23,42,0.6)",
        border: "1px solid rgba(99,102,241,0.15)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Demographics */}
      <SectionTitle>Demographics</SectionTitle>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField fullWidth label="Credit Limit (LIMIT_BAL)" name="LIMIT_BAL" type="number"
            value={form.LIMIT_BAL} onChange={handleChange} required sx={fieldStyle} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField fullWidth label="Age" name="AGE" type="number"
            value={form.AGE} onChange={handleChange} required sx={fieldStyle}
            inputProps={{ min: 18, max: 100 }} />
        </Grid>

      </Grid>

      <Divider sx={{ borderColor: "rgba(148,163,184,0.1)", my: 2 }} />

      {/* Repayment Status */}
      <SectionTitle>Repayment Status</SectionTitle>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[1, 2, 3].map((n) => (
          <Grid size={{ xs: 12, sm: 4 }} key={`pay${n}`}>
            <TextField fullWidth label={`PAY_${n}`} name={`PAY_${n}`} type="number"
              value={form[`PAY_${n}`]} onChange={handleChange} required sx={fieldStyle} />
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ borderColor: "rgba(148,163,184,0.1)", my: 2 }} />

      {/* Amounts */}
      <SectionTitle>Financial Amounts</SectionTitle>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField fullWidth label="BILL_AMT1" name="BILL_AMT1" type="number"
            value={form.BILL_AMT1} onChange={handleChange} required sx={fieldStyle} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField fullWidth label="PAY_AMT1" name="PAY_AMT1" type="number"
            value={form.PAY_AMT1} onChange={handleChange} required sx={fieldStyle} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField fullWidth label="PAY_AMT2" name="PAY_AMT2" type="number"
            value={form.PAY_AMT2} onChange={handleChange} required sx={fieldStyle} />
        </Grid>
      </Grid>

      {/* Buttons */}
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
          sx={{
            px: 5,
            py: 1.5,
            borderRadius: 3,
            fontWeight: 700,
            textTransform: "none",
            fontSize: 16,
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
            "&:hover": {
              background: "linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)",
              boxShadow: "0 6px 25px rgba(99,102,241,0.5)",
            },
          }}
        >
          {loading ? "Predicting…" : "Predict Risk"}
        </Button>
        <Button
          onClick={handleReset}
          variant="outlined"
          size="large"
          startIcon={<RestartAltIcon />}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 3,
            fontWeight: 600,
            textTransform: "none",
            fontSize: 16,
            borderColor: "rgba(148,163,184,0.3)",
            color: "#94a3b8",
            "&:hover": { borderColor: "#818cf8", color: "#818cf8", bgcolor: "rgba(99,102,241,0.06)" },
          }}
        >
          Reset
        </Button>
      </Box>
    </Paper>
  );
}
