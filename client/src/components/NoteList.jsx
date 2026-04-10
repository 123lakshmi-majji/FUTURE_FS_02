// client/src/components/NoteList.jsx
import { useState, useEffect } from 'react';
import api from '../api/axios';
import { format } from 'date-fns';
import { CalendarIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const NoteList = ({ leadId }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, [leadId]);

  const fetchNotes = async () => {
    try {
      const response = await api.get(`/leads/${leadId}/notes`);
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      const response = await api.post(`/notes/${leadId}`, {
        text: newNote,
        followUpDate: followUpDate || null,
      });
      setNotes([response.data, ...notes]);
      setNewNote('');
      setFollowUpDate('');
      toast.success('Note added successfully');
    } catch (error) {
      toast.error('Failed to add note');
    }
  };

  if (loading) return <div>Loading notes...</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Notes & Follow-ups</h3>
      
      <form onSubmit={handleAddNote} className="mb-6 space-y-3">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a note..."
          className="input-field"
          rows="3"
        />
        <div className="flex items-center space-x-3">
          <input
            type="date"
            value={followUpDate}
            onChange={(e) => setFollowUpDate(e.target.value)}
            className="input-field"
          />
          <button type="submit" className="btn-primary">Add Note</button>
        </div>
      </form>

      <div className="space-y-4">
        {notes.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No notes yet</p>
        ) : (
          notes.map((note) => (
            <div key={note._id} className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="text-gray-800 dark:text-gray-200">{note.text}</p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>{format(new Date(note.createdAt), 'MMM dd, yyyy h:mm a')}</span>
                {note.followUpDate && (
                  <span className="flex items-center">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    Follow-up: {format(new Date(note.followUpDate), 'MMM dd, yyyy')}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NoteList;