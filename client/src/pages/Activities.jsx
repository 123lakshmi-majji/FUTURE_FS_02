// client/src/pages/Activities.jsx
import { useEffect, useState } from 'react';
import api from '../api/axios';
import ActivityFeed from '../components/ActivityFeed.jsx';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await api.get('/activities');
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="stack page-with-bg">
        <div className="card">Loading...</div>
      </div>
    );
  }

  return (
    <div className="stack page-with-bg">
      <div className="page-header">
        <div>
          <h1 className="page-title">Activity Log</h1>
        </div>
      </div>
      <div className="card">
        <ActivityFeed activities={activities} />
      </div>
    </div>
  );
};

export default Activities;
