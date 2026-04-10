import React from "react";
import { formatDistanceToNow } from "date-fns";

const actionTone = (action) => {
  switch (action) {
    case "CREATE":
      return "activity-tag activity-tag--green";
    case "UPDATE":
      return "activity-tag activity-tag--blue";
    case "DELETE":
      return "activity-tag activity-tag--red";
    default:
      return "activity-tag";
  }
};

const formatTime = (value) =>
  value ? formatDistanceToNow(new Date(value), { addSuffix: true }) : "-";

const ActivityFeed = ({ activities = [] }) => {
  return (
    <div className="activity-feed">
      {activities.length === 0 ? (
        <div className="empty">No recent activities yet.</div>
      ) : (
        activities.map((activity) => (
          <div key={activity._id} className="activity-row">
            <div className="activity-meta">
              <div className="activity-title">
                <span className={actionTone(activity.action)}>{activity.action}</span>
                <span>{activity.details || "Updated lead"}</span>
              </div>
              <div className="activity-sub">
                <span>{activity.user?.name || "System"}</span>
                <span className="dot">•</span>
                <span>{activity.lead?.name || "Lead"}</span>
                <span className="dot">•</span>
                <span>{formatTime(activity.timestamp || activity.createdAt)}</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ActivityFeed;
