// client/src/pages/LeadDetails.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import NoteList from '../components/NoteList';
import toast from 'react-hot-toast';

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLead();
  }, [id]);

  const fetchLead = async () => {
    try {
      const response = await api.get(`/leads`);
      const leadData = response.data.leads.find(l => l._id === id);
      setLead(leadData);
    } catch (error) {
      console.error('Error fetching lead:', error);
      toast.error('Lead not found');
      navigate('/leads');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!lead) return <div>Lead not found</div>;

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/leads')} className="text-blue-600 hover:text-blue-800">
        ← Back to Leads
      </button>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{lead.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
            <p className="text-gray-900 dark:text-white">{lead.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
            <p className="text-gray-900 dark:text-white">{lead.phone || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Source</p>
            <p className="text-gray-900 dark:text-white capitalize">{lead.source}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
            <p className="text-gray-900 dark:text-white capitalize">{lead.status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
            <p className="text-gray-900 dark:text-white">{new Date(lead.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <NoteList leadId={id} />
    </div>
  );
};

export default LeadDetails;