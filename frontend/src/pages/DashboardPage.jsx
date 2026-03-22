import { useEffect, useState } from "react";
import {
  Container, Typography, Box, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, CircularProgress, Grid,
  Card, CardContent,
} from "@mui/material";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PercentIcon from "@mui/icons-material/Percent";
import api from "../api/api";

const PIE_COLORS = ["#22c55e", "#ef4444"];

function StatCard({ icon, label, value, color }) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        bgcolor: "rgba(15,23,42,0.6)",
        border: "1px solid rgba(99,102,241,0.15)",
        backdropFilter: "blur(12px)",
      }}
    >
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 3 }}>
        <Box
          sx={{
            width: 48, height: 48, borderRadius: 3, display: "flex",
            alignItems: "center", justifyContent: "center",
            background: `linear-gradient(135deg, ${color}22, ${color}44)`,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="body2" sx={{ color: "#94a3b8", fontSize: 12 }}>{label}</Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#f1f5f9" }}>{value}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/history")
      .then((res) => setHistory(res.data))
      .catch((err) => console.error("Failed to load history:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress sx={{ color: "#818cf8" }} />
      </Box>
    );
  }

  /* ── Derived stats ────────────────────────────────────────────── */
  const totalPredictions = history.length;
  const highRiskCount = history.filter((h) => h.prediction === 1).length;
  const lowRiskCount = totalPredictions - highRiskCount;
  const avgProbability = totalPredictions
    ? (history.reduce((sum, h) => sum + h.probability, 0) / totalPredictions * 100).toFixed(1)
    : 0;

  const pieData = [
    { name: "Low Risk", value: lowRiskCount },
    { name: "High Risk", value: highRiskCount },
  ];



  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 800, mb: 1, textAlign: "center",
          background: "linear-gradient(90deg, #818cf8 0%, #c084fc 50%, #f472b6 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}
      >
        Analytics Dashboard
      </Typography>
      <Typography variant="body1" sx={{ color: "#94a3b8", textAlign: "center", mb: 4 }}>
        Overview of all past credit risk predictions
      </Typography>

      {totalPredictions === 0 ? (
        <Paper elevation={0} sx={{ p: 6, textAlign: "center", borderRadius: 4, bgcolor: "rgba(15,23,42,0.6)", border: "1px solid rgba(99,102,241,0.15)" }}>
          <Typography sx={{ color: "#94a3b8" }}>No predictions yet. Go to the Predict page to get started!</Typography>
        </Paper>
      ) : (
        <>
          {/* Stat cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <StatCard icon={<PeopleAltIcon sx={{ color: "#818cf8" }} />} label="Total Predictions" value={totalPredictions} color="#818cf8" />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <StatCard icon={<TrendingUpIcon sx={{ color: "#ef4444" }} />} label="High Risk Count" value={highRiskCount} color="#ef4444" />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <StatCard icon={<PercentIcon sx={{ color: "#22c55e" }} />} label="Avg Default Prob" value={`${avgProbability}%`} color="#22c55e" />
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: "rgba(15,23,42,0.6)", border: "1px solid rgba(99,102,241,0.15)" }}>
                <Typography variant="h6" sx={{ color: "#f1f5f9", fontWeight: 700, mb: 2 }}>Risk Distribution</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} innerRadius={60} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i]} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#f1f5f9" }} />
                    <Legend wrapperStyle={{ color: "#94a3b8" }} />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>


          </Grid>

          {/* History table */}
          <Paper elevation={0} sx={{ borderRadius: 4, bgcolor: "rgba(15,23,42,0.6)", border: "1px solid rgba(99,102,241,0.15)", overflow: "hidden" }}>
            <Typography variant="h6" sx={{ color: "#f1f5f9", fontWeight: 700, p: 3, pb: 0 }}>
              Prediction History
            </Typography>
            <TableContainer sx={{ maxHeight: 420 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    {["#", "Age", "Limit", "Risk", "Probability", "Time"].map((h) => (
                      <TableCell key={h} sx={{ bgcolor: "#0f172a", color: "#94a3b8", fontWeight: 700, borderBottom: "1px solid rgba(148,163,184,0.1)" }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.map((row) => (
                    <TableRow key={row.id} sx={{ "&:hover": { bgcolor: "rgba(99,102,241,0.05)" } }}>
                      <TableCell sx={{ color: "#94a3b8", borderBottom: "1px solid rgba(148,163,184,0.06)" }}>{row.id}</TableCell>
                      <TableCell sx={{ color: "#f1f5f9", borderBottom: "1px solid rgba(148,163,184,0.06)" }}>{row.age}</TableCell>

                      <TableCell sx={{ color: "#f1f5f9", borderBottom: "1px solid rgba(148,163,184,0.06)" }}>{row.limit_bal?.toLocaleString()}</TableCell>
                      <TableCell sx={{ borderBottom: "1px solid rgba(148,163,184,0.06)" }}>
                        <Chip label={row.risk_level} size="small" sx={{
                          fontWeight: 700, fontSize: 11,
                          bgcolor: row.prediction === 1 ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)",
                          color: row.prediction === 1 ? "#ef4444" : "#22c55e",
                          border: `1px solid ${row.prediction === 1 ? "#ef4444" : "#22c55e"}`,
                        }} />
                      </TableCell>
                      <TableCell sx={{ color: "#f1f5f9", borderBottom: "1px solid rgba(148,163,184,0.06)" }}>{(row.probability * 100).toFixed(1)}%</TableCell>
                      <TableCell sx={{ color: "#94a3b8", fontSize: 12, borderBottom: "1px solid rgba(148,163,184,0.06)" }}>{new Date(row.created_at).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}
    </Container>
  );
}
