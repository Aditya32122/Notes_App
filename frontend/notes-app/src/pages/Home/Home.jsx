
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import NoteCard from '../../components/cards/NoteCard';
import { MdAdd } from 'react-icons/md';
import { AddEditNotes } from './AddEditNotes';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosinstance';
import moment from 'moment';
import Searchbar from '../../components/Searchbar/Searchbar';

Modal.setAppElement('#root');

export const Home = () => {
  const [openAddEditNote, setOpenAddEditNote] = useState({
    isShown: false,
    type: 'add',
    data: null
  });

  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  
  const [isSearch,setisSearch] = useState(false);

  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenAddEditNote({
      isShown: true,
      type: 'edit',
      data: noteDetails
    });
  };

  const handleDelete = async (noteId) => {
    try {
      await axiosInstance.delete(`/delete-note/${noteId}`);
      getAllNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handlePinNote = async (noteId, isPinned) => {
    try {
      await axiosInstance.put(`/pin-note/${noteId}`, { isPinned: !isPinned });
      getAllNotes();
    } catch (error) {
      console.error('Error pinning note:', error);
    }
  };

  // Get user info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('/get-user');
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };


  // Get notes
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get('/get-notes');
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();
    return () => {};
  }, []);

  const onSearchNote = async (searchQuery) => {
try{
  const response = await axiosInstance.get("/search-notes",{params:{query:searchQuery}});
  if(response.data && response.data.notes){
    setAllNotes(response.data.notes);
  }

}catch(error){
  console.error('Error searching notes:', error);
}
  };

  return (
    <>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote}/>
      <div className='container mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
          {allNotes.map((item, index) => (
            <NoteCard
              key={item._id}
              title={item.title}
              date={moment(item.createdAt).format('MMM DD, YYYY')}
              content={item.content}
              tags={item.tags}
              isPinned={item.isPinned}
              onEdit={() => handleEdit(item)}
              onDelete={() => handleDelete(item._id)}
              onPinNote={() => handlePinNote(item._id, item.isPinned)}
            />
          ))}
        </div>
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-500 hover:bg-blue-600 fixed right-10 bottom-10"
        onClick={() => { setOpenAddEditNote({ isShown: true, type: 'add', data: null }); }}
      >
        <MdAdd className='text-[32px] text-white' />
      </button>

      <Modal
        isOpen={openAddEditNote.isShown}
        style={{
          overlay: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)'
          },
          content: {
            position: 'relative',
            inset: 'auto',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            padding: '20px',
            borderRadius: '10px',
            backgroundColor: '#fff',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }
        }}
        onRequestClose={() => { setOpenAddEditNote({ isShown: false, type: 'add', data: null }); }}
        contentLabel="Add/Edit Note"
      >
        <AddEditNotes
          noteData={openAddEditNote.data}
          type={openAddEditNote.type}
          getAllNotes={getAllNotes}
          closeModal={() => setOpenAddEditNote({ isShown: false, type: 'add', data: null })}
        />
      </Modal>
    </>
  );
};

export default Home;