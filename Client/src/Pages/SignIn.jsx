
import { Link,useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart ,signInSuccess, signInFailure } from '../Redux/user/userSlice';
import OAuth from '../Components/Oauth';

export default function SignIn() {

  const [formData, setFormData] = useState({});

  const {loading, error} = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

   const handleChange = (e)=>{
       setFormData({
        ...formData,
        [e.target.id]: e.target.value,
       });
   };

   const handleSubmit = async (e)=>{
    e.preventDefault();
    try{
    dispatch(signInStart());
    const res = await fetch (`${import.meta.env.VITE_API_BASE_URL}/api/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(formData),
    });
    const data  = await res.json();
    console.log(data);
    if(data.success === false){
     dispatch(signInFailure(data.message));
      return;
    
   }
  dispatch(signInSuccess(data));
  navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));  
    } 
  };

  
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form className='flex flex-col gap-4 ' onSubmit={handleSubmit}>
       
        <input type="email" placeholder='email' className='border border-gray-400 p-3 rounded-lg  bg-white ' id='email' onChange={handleChange}  autoComplete="email" />

        <input type='password' placeholder='password' className='border border-gray-400 p-3 rounded-lg  bg-white' id='password' onChange={handleChange} autoComplete="current-password"/>

        <button disabled ={loading}   className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:backdrop-opacity-80 cursor-pointer'>{loading ? "Loading..." : "Sign In"} </button>

        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Dont Have an account?</p>
        <Link to={"/sign-up"} >
        <span className='text-blue-700'>Sign up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-3'>{error}</p>}
    </div>
  )
}
