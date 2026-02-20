import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Scan, Users2, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { mockAnalyticsData, mockDashboardStats } from "@/data/mockData";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl krona font-bold">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Performance de vos agents IA et analyses
        </p>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total scans", value: mockDashboardStats.qrCodesScanned, icon: Scan, trend: "+18%" },
          { label: "Analyses IA", value: mockDashboardStats.analysesCompleted, icon: Sparkles, trend: "+24%" },
          { label: "Leads", value: mockDashboardStats.leadsCollected, icon: Users2, trend: "+12%" },
          { label: "Taux de conv.", value: "24.6%", icon: TrendingUp, trend: "+3.2%" },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="clean-card">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-primary/5 rounded-lg border border-border">
                    <kpi.icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium" style={{ color: "#10B981" }}>
                    {kpi.trend}
                  </span>
                </div>
                <p className="text-2xl font-bold krona">{kpi.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="clean-card">
          <CardHeader>
            <CardTitle className="text-sm krona">Activité mensuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={mockAnalyticsData} barSize={16} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 92%)" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(0 0% 45%)" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(0 0% 45%)" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid hsl(0 0% 90%)",
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="scans" name="Scans" fill="hsl(0 0% 10%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="analyses" name="Analyses" fill="hsl(178 78% 47%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="leads" name="Leads" fill="hsl(156 73% 64%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Line Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="clean-card">
          <CardHeader>
            <CardTitle className="text-sm krona">Tendances</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={mockAnalyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 92%)" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(0 0% 45%)" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(0 0% 45%)" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid hsl(0 0% 90%)",
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="scans"
                  name="Scans"
                  stroke="hsl(0 0% 10%)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="leads"
                  name="Leads"
                  stroke="hsl(178 78% 47%)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
