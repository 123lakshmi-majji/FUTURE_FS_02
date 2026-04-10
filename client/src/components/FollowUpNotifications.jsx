import React from "react";
import { format } from "date-fns";

const defaultItems = [
  {
    id: "default-1",
    lead: { name: "Demo Lead", email: "demo@company.com" },
    followUpDate: new Date(),
  },
  {
    id: "default-2",
    lead: { name: "Sample Prospect", email: "sample@business.com" },
    followUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  },
];

export default function FollowUpNotifications({ followups = [] }) {
  const items = followups.length ? followups : defaultItems;

  return (
    <ul className="list">
      {items.map((item) => (
        <li key={item._id || item.id} className="list-item">
          <div className="list-title">
            {item.lead?.name || "Lead"} • {item.lead?.email || "email@example.com"}
          </div>
          <div className="list-meta">
            Follow-up: {format(new Date(item.followUpDate), "PP")}
          </div>
        </li>
      ))}
    </ul>
  );
}
