







import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Pagination,
  Alert,
  Fade,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import InboxIcon from "@mui/icons-material/Inbox";
import NotificationCard from "../components/NotificationCard";
import FilterBar from "../components/FilterBar";
import LoadingSpinner from "../components/LoadingSpinner";
import { fetchNotifications } from "../services/api";

const ITEMS_PER_PAGE = 10;

const Notifications = ({ onCountUpdate }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");

  
  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounced(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  
  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotifications(page, ITEMS_PER_PAGE, filter, searchDebounced);
      setNotifications(data.notifications || []);
      setTotal(data.total || 0);
      if (onCountUpdate) onCountUpdate(data.total || 0);
    } catch (err) {
      setError("Failed to load notifications. Please check your connection and try again.");
      setNotifications([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, filter, searchDebounced, onCountUpdate]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  
  useEffect(() => {
    setPage(1);
  }, [filter, searchDebounced]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <Fade in timeout={500}>
      <Box>
        {}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
            <NotificationsActiveIcon sx={{ color: "#60a5fa", fontSize: 28 }} />
            <Typography
              variant="h5"
              sx={{ color: "#e2e8f0", fontWeight: 700, letterSpacing: "-0.01em" }}
            >
              Notifications
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Browse campus placement, result, and event notifications
          </Typography>
        </Box>

        {}
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          search={search}
          onSearchChange={setSearch}
          totalCount={total}
        />

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
        {loading && <LoadingSpinner count={6} />}

        {}
        {!loading && !error && notifications.length > 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {notifications.map((notification, index) => (
              <Fade in timeout={300 + index * 50} key={notification.ID || index}>
                <Box>
                  <NotificationCard notification={notification} />
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
              No notifications found
            </Typography>
            <Typography variant="body2" sx={{ color: "#475569" }}>
              {filter || search
                ? "Try adjusting your filters or search query."
                : "There are no notifications available at the moment."}
            </Typography>
          </Box>
        )}

        {}
        {!loading && totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              shape="rounded"
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "#94a3b8",
                  borderColor: "rgba(255,255,255,0.08)",
                  fontSize: "0.875rem",
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
            />
          </Box>
        )}
      </Box>
    </Fade>
  );
};

export default Notifications;
