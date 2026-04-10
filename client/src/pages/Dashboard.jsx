import React, { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import api from "../api/axios";
import StatsCards from "../components/StatsCards.jsx";
import ActivityFeed from "../components/ActivityFeed.jsx";
import FollowUpNotifications from "../components/FollowUpNotifications.jsx";

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [activities, setActivities] = useState([]);
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [leadRes, activityRes, followupRes] = await Promise.all([
        api.get("/leads", { params: { page: 1, limit: 200 } }),
        api.get("/activities"),
        api.get("/followups/upcoming"),
      ]);
      setLeads(leadRes.data.leads || []);
      setActivities(activityRes.data || []);
      setFollowups(followupRes.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const statusCounts = useMemo(() => {
    const counts = {
      new: 0,
      contacted: 0,
      qualified: 0,
      converted: 0,
      lost: 0,
    };
    leads.forEach((lead) => {
      const key = lead.status || "new";
      if (counts[key] !== undefined) counts[key] += 1;
    });
    return counts;
  }, [leads]);

  const stats = useMemo(() => {
    const pending = statusCounts.new + statusCounts.contacted + statusCounts.qualified;
    return {
      total: leads.length,
      new: statusCounts.new,
      contacted: statusCounts.contacted,
      qualified: statusCounts.qualified,
      converted: statusCounts.converted,
      lost: statusCounts.lost,
      pending,
    };
  }, [leads.length, statusCounts]);

  const pieData = [
    { name: "New", value: statusCounts.new, color: "#2f6cf6" },
    { name: "Contacted", value: statusCounts.contacted, color: "#f5a524" },
    { name: "Qualified", value: statusCounts.qualified, color: "#10b981" },
    { name: "Converted", value: statusCounts.converted, color: "#6366f1" },
    { name: "Lost", value: statusCounts.lost, color: "#ef4444" },
  ];

  const sourceCounts = useMemo(() => {
    const counts = {};
    leads.forEach((lead) => {
      const key = (lead.source || "unknown").toLowerCase();
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [leads]);

  const barData = Object.keys(sourceCounts).map((key) => ({
    name: key,
    value: sourceCounts[key],
  }));

  return (
    <div className="stack page-with-bg">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
        </div>
        <div className="page-actions">
          <button className="btn secondary" onClick={fetchDashboard} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <StatsCards stats={stats} />

      <div className="grid cards-2">
        <div className="card card-compact">
          <h3 className="section-title">Lead Status</h3>
          <div className="chart-area">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={70} outerRadius={110} paddingAngle={4}>
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="#fff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="legend">
            {pieData.map((item) => (
              <div key={item.name} className="legend-item">
                <span className="legend-left">
                  <span className="legend-dot" style={{ background: item.color }}></span>
                  <span className="legend-name">{item.name}</span>
                </span>
                <span className="legend-count">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card card-compact">
          <h3 className="section-title">Leads by Source</h3>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={barData} margin={{ left: 0, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#2f6cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {!barData.length && <div className="empty">No source data yet.</div>}
        </div>
      </div>

      <div className="stack">
        <div className="card">
          <h3 className="section-title">Upcoming Follow-ups</h3>
          <FollowUpNotifications followups={followups} />
        </div>
      </div>
    </div>
  );
}
