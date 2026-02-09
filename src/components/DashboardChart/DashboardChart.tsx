import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from "recharts";
import { Box, Typography } from "@mui/material";

/* ================= TYPES ================= */

interface ComplaintStats {
  [key: string]: number;
}

interface DashboardData {
  complaintStats: ComplaintStats;
}

interface ChartItem {
  status: string;
  count: number;
}

interface ComplaintChartsProps {
  data: DashboardData;
}

/* ================= COLORS ================= */

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  in_progress: "#3b82f6",
  resolved: "#22c55e",
  closed: "#16a34a",
  rejected: "#ef4444",
  escalated: "#8b5cf6",
  assigned: "#06b6d4"
};

const formatLabel = (text: string) =>
  text.replace("_", " ").toUpperCase();

/* ================= CARD WRAPPER ================= */

const ChartCard = ({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Box
    sx={{
      bgcolor: "#fafafa",
      borderRadius: 3,
      p: 2,
      boxShadow: 1,
      width: "100%",
      height: 360
    }}
  >
    <Typography fontWeight={600} mb={1}>
      {title}
    </Typography>
    {children}
  </Box>
);

/* ================= COMPONENT ================= */

const ComplaintCharts: React.FC<ComplaintChartsProps> = ({ data }) => {
  const chartData: ChartItem[] = useMemo(() => {
    if (!data?.complaintStats) return [];

    return Object.entries(data.complaintStats)
      .filter(([_, value]) => value > 0)
      .map(([status, count]) => ({
        status,
        count
      }));
  }, [data]);

  if (chartData.length === 0) {
    return <Typography>No complaint statistics available</Typography>;
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "1fr 1fr"
        },
        gap: 3
      }}
    >
      {/* BAR CHART */}
      <ChartCard title="Complaints by Status (Bar)">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" tickFormatter={formatLabel} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count">
              {chartData.map((item, i) => (
                <Cell
                  key={i}
                  fill={STATUS_COLORS[item.status]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* PIE CHART */}
      <ChartCard title="Complaints Distribution (Pie)">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              outerRadius={90}
              label={({ status }:any) => formatLabel(status)}
            >
              {chartData.map((item, i) => (
                <Cell
                  key={i}
                  fill={STATUS_COLORS[item.status]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* LINE CHART */}
      <ChartCard title="Trend View (Line)">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" tickFormatter={formatLabel} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* AREA CHART */}
      <ChartCard title="Area Overview">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" tickFormatter={formatLabel} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Area
              dataKey="count"
              stroke="#22c55e"
              fill="#bbf7d0"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </Box>
  );
};

export default ComplaintCharts;
