import React, { useState,useEffect } from 'react'
import { Link } from 'react-router-dom';

export default function Contact({listing}) {
    const [landlord,setLandlord] = useState(null);
    const [message,setMessage] = useState('');

  const onChange = (e) => {
         setMessage(e.target.value);
    }
    useEffect(() => {
       const fetchLandLord = async ()=>{
        try {
            const res  = await fetch (`${import.meta.env.VITE_API_BASE_URL}/api/user/${listing.userRef},
              credentials: 'include'`);
            const data = await res.json();
             console.log('Fetched landlord data:', data);
            setLandlord(data);
        } 
        catch(error){
            console.log(error);
        }
       }
           fetchLandLord();
    }, [listing.userRef])
    
  return (
  <>
  {landlord &&(
    <div className='flex flex-col gap-2 '> 
        <p>Contact <span className='font-semibold'>{landlord.username}</span> for <span className='font-semibold'>{listing.name.toLowerCase()}</span> </p>

        <textarea 
        className='border w-full p-3 rounded-lg'
        name="message"
        id="message"
        rows='2'
        value={message}
        onChange={onChange}
        placeholder='Enter your message here'
        ></textarea>

        <Link className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'  to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}>
        Send message
        </Link>

    </div>
  )}
  </>
  )
}
