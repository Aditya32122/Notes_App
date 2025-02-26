import React from 'react'
import { getInitials } from '../../utils/helper'

export default function ProfileInfo( { userInfo , onLogout} ) {
  return (
    <div className='flex items-center gap-2'>
       <div className='w-12 h-12 flex items-center justify-center bg-gray-300 rounded-full'>
            {getInitials(userInfo?.fullName)}
       </div>
        
        <div>
            <p className='text-sm font-semibold'>{userInfo?.fullName}</p>
            <button className='text-xs text-blue-500' onClick={onLogout}>Logout</button>
        </div>   
    </div>

  )
}
