import React from 'react';
import { MdOutlinePushPin, MdCreate, MdDelete } from 'react-icons/md';

export default function NoteCard({ title, date, content, tags, isPinned, onEdit, onDelete, onPinNote }) {
  return (
    <div className='border border-gray-200 rounded-lg p-4 bg-white hover:shadow-xl transition-all duration-300 ease-in-out'>
      <div className='flex justify-between items-center'>
        <div>
          <h6 className='text-sm font-medium'>{title}</h6>
          <span className='text-sm text-slate-500'>{date}</span>
        </div>
        <MdOutlinePushPin className={`icon-btn ${isPinned ? 'text-primary' : 'text-slate-300'}`} onClick={onPinNote} />
      </div>

      <p className='text-sm text-slate-600 mt-2'>{content ? content.slice(0, 60) : 'No content available'}</p>

      <div className='flex justify-between mt-2'>
        <div className='flex items-center gap-2'>
          <MdCreate
            className='icon-btn hover:text-green-600'
            onClick={onEdit}
          />
          <MdDelete
            className='icon-btn hover:text-red-600'
            onClick={onDelete}
          />
        </div>
        <div className='flex items-center gap-2'>
          {tags && tags.map((tag, index) => (
            <span key={index} className='text-xs bg-gray-200 rounded-full px-2 py-1'>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}