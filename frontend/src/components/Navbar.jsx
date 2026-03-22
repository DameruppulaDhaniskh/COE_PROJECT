import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import CreditScoreIcon from "@mui/icons-material/CreditScore";

const navItems = [
  { label: "Predict", path: "/" },
  { label: "Dashboard", path: "/dashboard" },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        borderBottom: "1px solid rgba(99, 102, 241, 0.2)",
      }}
    >
      <Toolbar sx={{ maxWidth: 1200, width: "100%", mx: "auto" }}>
        <CreditScoreIcon sx={{ mr: 1.5, color: "#818cf8", fontSize: 28 }} />
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            background: "linear-gradient(90deg, #818cf8, #c084fc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.02em",
          }}
        >
          CreditGuard AI
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              sx={{
                color: location.pathname === item.path ? "#818cf8" : "#94a3b8",
                fontWeight: location.pathname === item.path ? 700 : 500,
                borderRadius: 2,
                px: 2,
                "&:hover": {
                  background: "rgba(129, 140, 248, 0.08)",
                  color: "#818cf8",
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
