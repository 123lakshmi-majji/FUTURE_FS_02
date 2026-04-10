// client/src/pages/Leads.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import LeadTable from '../components/LeadTable';
import LeadFormModal from '../components/LeadFormModal';
import toast from 'react-hot-toast';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);
  const navigate = useNavigate();

  const limit = 10;

  useEffect(() => {
    fetchLeads();
  }, [search, statusFilter, sourceFilter, sortField, sortOrder, currentPage]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit,
        search,
        status: statusFilter,
        source: sourceFilter,
        sortField,
        sortOrder,
      };
      const response = await api.get('/leads', { params });
      setLeads(response.data.leads);
      setTotalPages(response.data.pagination.pages);
      setTotalLeads(response.data.pagination.total);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = async (leadData) => {
    setIsSubmitting(true);
    try {
      await api.post('/leads', leadData);
      toast.success('Lead created successfully');
      fetchLeads();
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to create lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditLead = async (leadData) => {
    setIsSubmitting(true);
    try {
      await api.put(`/leads/${editingLead._id}`, leadData);
      toast.success('Lead updated successfully');
      fetchLeads();
      setEditingLead(null);
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to update lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLead = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await api.delete(`/leads/${id}`);
        toast.success('Lead deleted successfully');
        fetchLeads();
      } catch (error) {
        toast.error('Failed to delete lead');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/leads/${id}`, { status: newStatus });
      toast.success('Status updated');
      fetchLeads();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleExport = async () => {
    try {
      const params = {
        search,
        status: statusFilter,
        source: sourceFilter,
      };
      const response = await api.get('/export/leads', { params, responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'leads.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Export started');
    } catch (error) {
      toast.error('Export failed');
    }
  };

  const handleSort = (field, order) => {
    setSortField(field);
    setSortOrder(order);
    setCurrentPage(1);
  };

  return (
    <div className="stack page-with-bg">
      <div className="page-header">
        <div>
          <h1 className="page-title">Lead Management</h1>
        </div>
        <div className="actions">
          <button onClick={handleExport} className="btn secondary">Export CSV</button>
          <button onClick={() => navigate('/leads/new')} className="btn">Add Lead</button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="filters">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
          </select>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="input"
          >
            <option value="">All Sources</option>
            <option value="website">Website</option>
            <option value="social">Social Media</option>
            <option value="referral">Referral</option>
          </select>
          <button onClick={() => {
            setSearch('');
            setStatusFilter('');
            setSourceFilter('');
            setCurrentPage(1);
          }} className="btn secondary">Clear Filters</button>
        </div>
      </div>

      {/* Lead Table */}
      {loading ? (
        <div className="card">Loading...</div>
      ) : (
        <>
          <div className="card">
            <LeadTable
              leads={leads}
              onEdit={(lead) => {
                navigate(`/leads/${lead._id}/edit`);
              }}
              onDelete={handleDeleteLead}
              onStatusChange={handleStatusChange}
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="btn secondary"
              >
                Previous
              </button>
              <span className="muted">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="btn secondary"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <LeadFormModal
        isOpen={isModalOpen}
        lead={editingLead}
        onSubmit={editingLead ? handleEditLead : handleAddLead}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLead(null);
        }}
      />
    </div>
  );
};

export default Leads;
