
import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Typography,
  Chip,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";


const inputStyles = {
  "& .MuiOutlinedInput-root": {
    color: "#cbd5e1",
    fontSize: "0.875rem",
    borderRadius: 2,
    bgcolor: "rgba(15, 23, 42, 0.5)",
    "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
    "&:hover fieldset": { borderColor: "rgba(96,165,250,0.3)" },
    "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
  },
  "& .MuiInputLabel-root": { color: "#64748b", fontSize: "0.875rem" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#60a5fa" },
};

const FilterBar = ({ filter, onFilterChange, search, onSearchChange, totalCount }) => {
  return (
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
      <FormControl size="small" sx={{ minWidth: 160, ...inputStyles }}>
        <InputLabel id="filter-type-label">
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <FilterListIcon fontSize="small" />
            Filter Type
          </Box>
        </InputLabel>
        <Select
          labelId="filter-type-label"
          id="filter-type-select"
          value={filter}
          label="Filter Type   "
          onChange={(e) => onFilterChange(e.target.value)}
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: "#0f1729",
                border: "1px solid rgba(255,255,255,0.08)",
                "& .MuiMenuItem-root": {
                  color: "#cbd5e1",
                  fontSize: "0.875rem",
                  "&:hover": { bgcolor: "rgba(96,165,250,0.08)" },
                  "&.Mui-selected": {
                    bgcolor: "rgba(96,165,250,0.12)",
                    "&:hover": { bgcolor: "rgba(96,165,250,0.18)" },
                  },
                },
              },
            },
          }}
        >
          <MenuItem value="">All Types</MenuItem>
          <MenuItem value="Placement">Placement</MenuItem>
          <MenuItem value="Result">Result</MenuItem>
          <MenuItem value="Event">Event</MenuItem>
        </Select>
      </FormControl>

      {}
      <TextField
        size="small"
        placeholder="Search notifications..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ minWidth: 240, flexGrow: 1, maxWidth: 400, ...inputStyles }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#64748b", fontSize: 20 }} />
              </InputAdornment>
            ),
          },
        }}
      />

      {}
      {totalCount !== undefined && (
        <Chip
          label={`${totalCount} notification${totalCount !== 1 ? "s" : ""}`}
          size="small"
          sx={{
            bgcolor: "rgba(96,165,250,0.08)",
            color: "#94a3b8",
            border: "1px solid rgba(96,165,250,0.15)",
            fontWeight: 500,
            fontSize: "0.8rem",
            ml: "auto",
          }}
        />
      )}
    </Box>
  );
};

export default FilterBar;
