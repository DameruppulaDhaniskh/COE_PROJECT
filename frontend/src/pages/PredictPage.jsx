import { useState } from "react";
import { Container, Typography, Box, Alert } from "@mui/material";
import PredictionForm from "../components/PredictionForm";
import ResultCard from "../components/ResultCard";
import api from "../api/api";

export default function PredictPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async (formData) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await api.post("/predict", formData);
      setResult(res.data);
    } catch (err) {
      setError(
        err.response?.data?.detail?.[0]?.msg ||
        err.response?.data?.detail ||
        "Something went wrong. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            background: "linear-gradient(90deg, #818cf8 0%, #c084fc 50%, #f472b6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 1,
          }}
        >
          Credit Risk Prediction
        </Typography>
        <Typography variant="body1" sx={{ color: "#94a3b8", maxWidth: 600, mx: "auto" }}>
          Enter the credit card holder&apos;s information below to predict the likelihood of default on the next payment.
        </Typography>
      </Box>

      <PredictionForm onSubmit={handlePredict} loading={loading} />

      {error && (
        <Alert severity="error" sx={{ mt: 3, borderRadius: 3 }}>
          {typeof error === "string" ? error : JSON.stringify(error)}
        </Alert>
      )}

      <ResultCard result={result} />
    </Container>
  );
}
