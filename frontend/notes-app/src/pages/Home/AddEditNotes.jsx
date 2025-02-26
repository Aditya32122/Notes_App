
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosinstance';

export const AddEditNotes = ({ noteData, type, getAllNotes, closeModal }) => {
  const [title, setTitle] = useState(noteData?.title || '');
  const [content, setContent] = useState(noteData?.content || '');
  const [tags, setTags] = useState(noteData?.tags.join(', ') || '');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (noteData) {
      setTitle(noteData.title);
      setContent(noteData.content);
      setTags(noteData.tags.join(', '));
    }
  }, [noteData]);

  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post('/add-note', {
        title,
        content,
        tags: tags.split(',').map(tag => tag.trim())
      });
      if (response.data && response.data.note) {
        getAllNotes();
        closeModal();
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const updateNote = async () => {
    try {
      const response = await axiosInstance.put(`/edit-note/${noteData._id}`, {
        title,
        content,
        tags: tags.split(',').map(tag => tag.trim())
      });
      if (response.data && response.data.note) {
        getAllNotes();
        closeModal();
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const handleSubmit = async () => {
    try {
        if (type === 'add') {
            await addNewNote(); 
        } else {
            await updateNote(); 
        }
        getAllNotes(); // Fetch latest notes
        closeModal(); // Close modal after API call completes
    } catch (error) {
        console.error("Error adding/updating note:", error);
    }
};


  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6">
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-600">Title</label>
        <input
          type="text"
          className="text-lg text-gray-800 border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mt-6">
        <label className="text-sm font-semibold text-gray-600">Content</label>
        <textarea
          className="text-sm text-gray-800 border border-gray-300 rounded-md p-3 outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter content"
          rows={8}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-600">Tags (comma separated)</label>
        <input
          type="text"
          className="text-sm text-gray-800 border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>

      <button
        className="w-full bg-blue-500 text-white font-medium py-3 rounded-lg mt-6 hover:bg-blue-600 transition-colors"
        onClick={handleSubmit}
      >
        {type === 'add' ? 'Add Note' : 'Update Note'}
      </button>
    </div>
  );
};

export default AddEditNotes;