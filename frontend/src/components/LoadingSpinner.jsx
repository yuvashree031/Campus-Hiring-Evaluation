






import React from "react";
import { Box, Skeleton, Card, CardContent } from "@mui/material";

const LoadingSpinner = ({ count = 6 }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {Array.from({ length: count }).map((_, index) => (
        <Card
          key={index}
          elevation={0}
          sx={{
            bgcolor: "rgba(15, 23, 42, 0.6)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            {}
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
              <Skeleton
                variant="rounded"
                width={100}
                height={24}
                sx={{ bgcolor: "rgba(255,255,255,0.05)", borderRadius: 2 }}
              />
              <Skeleton
                variant="rounded"
                width={140}
                height={16}
                sx={{ bgcolor: "rgba(255,255,255,0.04)" }}
              />
            </Box>
            {}
            <Skeleton
              variant="text"
              width="90%"
              height={20}
              sx={{ bgcolor: "rgba(255,255,255,0.05)", mb: 0.5 }}
            />
            <Skeleton
              variant="text"
              width="65%"
              height={20}
              sx={{ bgcolor: "rgba(255,255,255,0.04)" }}
            />
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default LoadingSpinner;
