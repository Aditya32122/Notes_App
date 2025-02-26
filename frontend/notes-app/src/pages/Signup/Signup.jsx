import React ,{ useState } from 'react'
import Navbar from '../../components/Navbar'
import { Link, useNavigate } from 'react-router-dom'
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosinstance';

export const Signup = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); 

  const navigate = useNavigate();
    
  const handleSignup = async (e) => {
    e.preventDefault();
    if (name.length < 3) {
      setError('Name must be at least 3 characters');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (!validateEmail(email)) {
      setError('Invalid Email');
      return;
    }
    setError(null);
    //Signup API call
    try {
      const response = await axiosInstance.post('/create-account', {
        fullName: name,
        email,
        password
      });
    
    if (response.data && response.data.error) {
      setError(response.data.message);
      return;
    }
    if (response.data && response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
      navigate('/dashboard');
      
  }
}
  catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      setError(error.response.data.message);
    }
    else {
      setError('Something went wrong. Please try again later');
    }
  }
    
  }
  return (
   <>
       <Navbar />
       <div className='flex items-center justify-center min-h-screen bg-gray-100'>
         <div className="w-96 bg-white px-7 py-10 shadow-lg rounded-lg">
           <form onSubmit={handleSignup}>
             <h1 className='text-2xl font-bold text-center mb-7'>Signup</h1>
              <input type='text' value={name} onChange={(e) => setName(e.target.value)} placeholder='Name' className='w-full h-10 mt-4 border-2 border-gray-300 rounded-lg pl-2' />
              <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' className='w-full h-10 mt-4 border-2 border-gray-300 rounded-lg pl-2' />
              <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' className='w-full h-10 mt-4 border-2 border-gray-300 rounded-lg pl-2' />
              {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
              <p className='text-center mt-4'>Already have an account? <Link to='/login' className='text-blue-500'>Login</Link></p>
              <button type='submit' className='w-full h-10 mt-4 bg-blue-500 text-white rounded-lg'>Signup</button>
              </form>
            </div>
            </div>
            </>
  )
}
