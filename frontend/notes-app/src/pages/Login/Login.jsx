import React,{ useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosinstance';

export const Login = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  

  const handleLogin = async (e) => {
    e.preventDefault();
    
    (!validateEmail(email)) ? setError('Invalid Email') : setError(null);
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    //Login API call
    try {
      const response = await axiosInstance.post('/login', {
        email,
        password
      });
    
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
};

  return (

    <>
      <Navbar />
      <div className='flex items-center justify-center min-h-screen bg-gray-100'>
        <div className="w-96 bg-white px-7 py-10 shadow-lg rounded-lg">
          <form onSubmit={handleLogin}>
            <h1 className='text-2xl font-bold text-center mb-7'>Login</h1>
            <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' className='w-full h-10 mt-4 border-2 border-gray-300 rounded-lg pl-2' />
            <input type='password' value={password} onChange={(e) => {setPassword(e.target.value)}} placeholder='Password' className='w-full h-10 mt-4 border-2 border-gray-300 rounded-lg pl-2' />
            {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
            <button type='submit' className='w-full h-10 mt-4 bg-blue-500 text-white rounded-lg'>Login</button>
            <p className='text-center mt-4'>Don't have an account? <Link to='/signup' className='text-blue-500'>Register</Link></p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;