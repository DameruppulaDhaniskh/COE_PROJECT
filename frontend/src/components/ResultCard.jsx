import { Card, CardContent, Typography, Box, Chip, LinearProgress } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

export default function ResultCard({ result }) {
  if (!result) return null;

  const isHighRisk = result.prediction === 1;
  const pct = (result.probability * 100).toFixed(2);

  return (
    <Card
      elevation={0}
      sx={{
        mt: 4,
        borderRadius: 4,
        overflow: "hidden",
        border: `1px solid ${isHighRisk ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`,
        background: isHighRisk
          ? "linear-gradient(135deg, rgba(239,68,68,0.05) 0%, rgba(239,68,68,0.02) 100%)"
          : "linear-gradient(135deg, rgba(34,197,94,0.05) 0%, rgba(34,197,94,0.02) 100%)",
      }}
    >
      <CardContent sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          {isHighRisk ? (
            <WarningAmberIcon sx={{ fontSize: 40, color: "#ef4444" }} />
          ) : (
            <CheckCircleOutlineIcon sx={{ fontSize: 40, color: "#22c55e" }} />
          )}
          <Box>
            <Typography variant="subtitle2" sx={{ color: "#94a3b8", fontSize: 12, letterSpacing: 1 }}>
              PREDICTION RESULT
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#f1f5f9" }}>
              {result.risk_level}
            </Typography>
          </Box>
          <Chip
            label={isHighRisk ? "DEFAULT" : "NO DEFAULT"}
            size="small"
            sx={{
              ml: "auto",
              fontWeight: 700,
              bgcolor: isHighRisk ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)",
              color: isHighRisk ? "#ef4444" : "#22c55e",
              border: `1px solid ${isHighRisk ? "#ef4444" : "#22c55e"}`,
            }}
          />
        </Box>

        {/* Probability bar */}
        <Typography variant="body2" sx={{ color: "#94a3b8", mb: 1 }}>
          Default Probability
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <LinearProgress
            variant="determinate"
            value={result.probability * 100}
            sx={{
              flex: 1,
              height: 10,
              borderRadius: 5,
              bgcolor: "rgba(255,255,255,0.06)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 5,
                background: isHighRisk
                  ? "linear-gradient(90deg, #f97316, #ef4444)"
                  : "linear-gradient(90deg, #22c55e, #14b8a6)",
              },
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 700, color: isHighRisk ? "#ef4444" : "#22c55e", minWidth: 60 }}>
            {pct}%
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
