







import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
  Fade,
  Chip,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import NotificationCard from "../components/NotificationCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { fetchPriorityNotifications } from "../services/api";

const TOP_N_OPTIONS = [5, 10, 20];

const PriorityInbox = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topN, setTopN] = useState(10);

  
  const loadPriorityNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPriorityNotifications(topN);
      setNotifications(data.notifications || []);
    } catch (err) {
      setError("Failed to load priority notifications. Please try again.");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [topN]);

  useEffect(() => {
    loadPriorityNotifications();
  }, [loadPriorityNotifications]);

  
  const typeCounts = notifications.reduce((acc, n) => {
    const type = n.Type || "Event";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  return (
    <Fade in timeout={500}>
      <Box>
        {}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
            <InboxIcon sx={{ color: "#60a5fa", fontSize: 28 }} />
            <Typography
              variant="h5"
              sx={{ color: "#e2e8f0", fontWeight: 700, letterSpacing: "-0.01em" }}
            >
              Priority Inbox
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Top notifications ranked by importance. Placement notifications are given
            the highest priority.
          </Typography>
        </Box>

        {}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
            mb: 3,
          }}
        >
          {}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography variant="body2" sx={{ color: "#94a3b8", fontWeight: 500 }}>
              Show top
            </Typography>
            <ToggleButtonGroup
              value={topN}
              exclusive
              onChange={(_, value) => { if (value !== null) setTopN(value); }}
              size="small"
              sx={{
                "& .MuiToggleButton-root": {
                  color: "#94a3b8",
                  borderColor: "rgba(255,255,255,0.08)",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  px: 2,
                  py: 0.5,
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "rgba(96,165,250,0.08)",
                    borderColor: "rgba(96,165,250,0.3)",
                  },
                  "&.Mui-selected": {
                    bgcolor: "rgba(59,130,246,0.15)",
                    color: "#60a5fa",
                    borderColor: "rgba(59,130,246,0.3)",
                    fontWeight: 600,
                    "&:hover": { bgcolor: "rgba(59,130,246,0.2)" },
                  },
                },
              }}
            >
              {TOP_N_OPTIONS.map((n) => (
                <ToggleButton key={n} value={n}>
                  {n}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>

          {}
          {!loading && notifications.length > 0 && (
            <Box sx={{ display: "flex", gap: 1, ml: "auto", flexWrap: "wrap" }}>
              {typeCounts.Placement && (
                <Chip
                  icon={<PriorityHighIcon sx={{ fontSize: 14 }} />}
                  label={`${typeCounts.Placement} Placement`}
                  size="small"
                  sx={{
                    bgcolor: "rgba(59,130,246,0.08)",
                    color: "#60a5fa",
                    border: "1px solid rgba(59,130,246,0.2)",
                    fontWeight: 500,
                    fontSize: "0.75rem",
                    "& .MuiChip-icon": { color: "#60a5fa" },
                  }}
                />
              )}
              {typeCounts.Result && (
                <Chip
                  label={`${typeCounts.Result} Result`}
                  size="small"
                  sx={{
                    bgcolor: "rgba(139,92,246,0.08)",
                    color: "#a78bfa",
                    border: "1px solid rgba(139,92,246,0.2)",
                    fontWeight: 500,
                    fontSize: "0.75rem",
                  }}
                />
              )}
              {typeCounts.Event && (
                <Chip
                  label={`${typeCounts.Event} Event`}
                  size="small"
                  sx={{
                    bgcolor: "rgba(6,182,212,0.08)",
                    color: "#22d3ee",
                    border: "1px solid rgba(6,182,212,0.2)",
                    fontWeight: 500,
                    fontSize: "0.75rem",
                  }}
                />
              )}
            </Box>
          )}
        </Box>

        {}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              bgcolor: "rgba(239, 68, 68, 0.08)",
              color: "#fca5a5",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              "& .MuiAlert-icon": { color: "#ef4444" },
            }}
          >
            {error}
          </Alert>
        )}

        {}
        {loading && <LoadingSpinner count={topN > 10 ? 8 : topN} />}

        {}
        {!loading && !error && notifications.length > 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {notifications.map((notification, index) => (
              <Fade in timeout={300 + index * 50} key={notification.ID || index}>
                <Box>
                  <NotificationCard
                    notification={notification}
                    showPriority
                    highlight={notification.Type === "Placement"}
                  />
                </Box>
              </Fade>
            ))}
          </Box>
        )}

        {}
        {!loading && !error && notifications.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              px: 3,
              bgcolor: "rgba(15, 23, 42, 0.4)",
              borderRadius: 3,
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <InboxIcon sx={{ fontSize: 48, color: "#334155", mb: 2 }} />
            <Typography variant="h6" sx={{ color: "#64748b", fontWeight: 500, mb: 1 }}>
              No priority notifications
            </Typography>
            <Typography variant="body2" sx={{ color: "#475569" }}>
              There are no notifications available to prioritize at the moment.
            </Typography>
          </Box>
        )}
      </Box>
    </Fade>
  );
};

export default PriorityInbox;
