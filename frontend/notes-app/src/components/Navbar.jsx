import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ProfileInfo from '../components/cards/ProfileInfo';
import Searchbar from './Searchbar/Searchbar';

export default function Navbar({ userInfo, onSearchNote }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const onLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleSearch = () => {
    onSearchNote(searchQuery);
  };

  const onClearSearch = () => {
    setSearchQuery('');
    onSearchNote(''); // Clear search results when search query is cleared
  };

  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow'>
      <h1 className='text-2xl font-bold'>iNoteBook</h1>
      
      <Searchbar
        value={searchQuery}
        onChange={({ target }) => setSearchQuery(target.value)}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />
      
      {location.pathname !== '/login' && location.pathname !== '/signup' && userInfo && (
        <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
      )}
    </div>
  );
}