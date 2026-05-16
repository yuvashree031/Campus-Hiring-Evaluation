







import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Tooltip,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";


const TYPE_CONFIG = {
  Placement: {
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.10)",
    borderColor: "rgba(59, 130, 246, 0.25)",
    icon: <WorkIcon fontSize="small" />,
    label: "Placement",
  },
  Result: {
    color: "#8b5cf6",
    bgColor: "rgba(139, 92, 246, 0.10)",
    borderColor: "rgba(139, 92, 246, 0.25)",
    icon: <AssignmentIcon fontSize="small" />,
    label: "Result",
  },
  Event: {
    color: "#06b6d4",
    bgColor: "rgba(6, 182, 212, 0.10)",
    borderColor: "rgba(6, 182, 212, 0.25)",
    icon: <EventIcon fontSize="small" />,
    label: "Event",
  },
};




const formatTimestamp = (timestamp) => {
  if (!timestamp) return "Unknown";
  try {
    const date = new Date(timestamp.replace(" ", "T"));
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return timestamp;
  }
};

const NotificationCard = ({ notification, showPriority = false, highlight = false }) => {
  const type = notification.Type || "Event";
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.Event;

  return (
    <Card
      elevation={0}
      sx={{
        bgcolor: highlight ? "rgba(59, 130, 246, 0.04)" : "rgba(15, 23, 42, 0.6)",
        border: `1px solid ${highlight ? config.borderColor : "rgba(255,255,255,0.06)"}`,
        borderRadius: 3,
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          borderColor: config.borderColor,
          bgcolor: config.bgColor,
          transform: "translateY(-2px)",
          boxShadow: `0 8px 25px -5px ${config.color}15`,
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.5 }, "&:last-child": { pb: { xs: 2, sm: 2.5 } } }}>
        {}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1.5,
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Chip
            icon={config.icon}
            label={config.label}
            size="small"
            sx={{
              bgcolor: config.bgColor,
              color: config.color,
              border: `1px solid ${config.borderColor}`,
              fontWeight: 600,
              fontSize: "0.75rem",
              letterSpacing: "0.02em",
              "& .MuiChip-icon": { color: config.color },
            }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <AccessTimeIcon sx={{ fontSize: 14, color: "#64748b" }} />
            <Typography variant="caption" sx={{ color: "#64748b", fontSize: "0.75rem" }}>
              {formatTimestamp(notification.Timestamp)}
            </Typography>
          </Box>
        </Box>

        {}
        <Typography
          variant="body2"
          sx={{
            color: "#cbd5e1",
            lineHeight: 1.65,
            fontSize: "0.9rem",
          }}
        >
          {notification.Message}
        </Typography>

        {}
        {showPriority && notification.priority_score !== undefined && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1.5 }}>
            <Tooltip title="Priority Score" arrow>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  bgcolor: "rgba(59,130,246,0.08)",
                  borderRadius: 1.5,
                  px: 1,
                  py: 0.3,
                }}
              >
                <TrendingUpIcon sx={{ fontSize: 14, color: "#60a5fa" }} />
                <Typography
                  variant="caption"
                  sx={{ color: "#60a5fa", fontWeight: 600, fontSize: "0.75rem" }}
                >
                  {notification.priority_score}
                </Typography>
              </Box>
            </Tooltip>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
