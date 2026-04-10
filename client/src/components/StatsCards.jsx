import React from "react";

export default function StatsCards({ stats }) {
  const cards = [
    { label: "New", value: stats.new, tone: "tone-blue" },
    { label: "Contacted", value: stats.contacted, tone: "tone-amber" },
    { label: "Qualified", value: stats.qualified, tone: "tone-teal" },
    { label: "Converted", value: stats.converted, tone: "tone-green" },
    { label: "Lost", value: stats.lost, tone: "tone-red" },
    { label: "Total Leads", value: stats.total, tone: "tone-indigo" },
    { label: "Pending", value: stats.pending, tone: "tone-slate" },
  ];

  return (
    <div className="stats-grid stats-grid--compact">
      {cards.map((card) => (
        <div className="stat-card stat-card--compact" key={card.label}>
          <div className={`stat-pill ${card.tone}`}></div>
          <div className="stat-copy">
            <div className="stat-label">{card.label}</div>
            <div className="stat-value">{card.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
