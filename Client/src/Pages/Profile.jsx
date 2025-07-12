import React from "react";
import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { updateUserStart,updateUserSuccess,updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart, signOutUserFailure, signOutUserSuccess } from "../Redux/user/userSlice";
import { useDispatch } from "react-redux";
import {Link} from 'react-router-dom';

export default function Profile() {
  const fileRef = useRef(null);
  const currentUser = useSelector((state) => state.user.currentUser);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.user.isLoading);
  const error = useSelector((state) => state.user.error);
  const [updateSuccess,setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  useEffect(() => {
    if (file) {
      const handleFileUpload = async (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setFilePerc(Math.round(progress));
          },

          (error) => {
            console.error("Upload error:", error);
            setFileUploadError(true);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setFormData((prev) => ({ ...prev, avatar: downloadURL }));
            });
          }
        );
      };

      handleFileUpload(file);
    }
  }, [file]);

  

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value });
  }

  const handleSubmit =  async(e) =>{
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/user/update/${currentUser._id}` ,{
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      }); 
      const data = await res.json();
      if(data.success=== false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
       dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async () => {
    try {
       dispatch(deleteUserStart());
       const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
       });
        const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      console.error("Error deleting user:", error);
      dispatch(deleteUserFailure(error.message));
      
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/signout`);
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess());
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
     
      return;
    }
  }
  const handleShowListings = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }
      setUserListings(data);
    } catch {
      
      setShowListingError(true);
    }
  };

 const handleListingDelete = async (listingId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this listing?");
  if (!confirmDelete)  return;
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/listing/delete/${listingId}`, {
      method: 'DELETE',
    });
    const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prev)=>
         prev.filter(listing => listing._id !== listingId));

  } catch (error) {
    console.error(error.message);
  }
 }


  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center m-7 ">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />

        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer mt-2 self-center"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>

        <input
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg"
          onChange={handleChange}

        />
        <input
          type="text"
          placeholder="email"
          defaultValue={currentUser.email}
          id="email"
          className="border p-3 rounded-lg"
          onChange={handleChange}

        />
        <input
          type="password"
          placeholder="password"
         onChange={handleChange}
          id="password"
          className="border p-3 rounded-lg"
          
        />
        <button disabled={loading} 
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 
        disabled:opacity-80 cursor-pointer"
        >
          {loading ? "Updating..." : "Update"}
        </button>
        <Link className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95" to={'/create-listing'}>
        Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign out</span>
      </div>
      <p>{error && <span className="text-red-700">{error}</span>}</p>
      <p className="text-green-700">
        {updateSuccess ? 'updated succesfully' : ''}
      </p>

      <button onClick={handleShowListings} className="text-green-700 w-full cursor-pointer">Show Listings</button>
      <p className="text-red-700 mt-5">{showListingError ? 'Error showing listings' : ''}</p>

       {userListings && userListings.length > 0 &&
       <div>
        <h2 className="text-2xl font-semibold mt-5 mb-3">Your Listings</h2>
        {userListings.map((listing) => (
          <div key={listing._id}  className="border rounded-lg p-3 flex justify-between items-center mb-3 gap-3">
            <Link to={`/listing/${listing._id}`}>
            <img src={listing.imageUrls[0]} alt="listing cover" className="h-16 w-16 object-contain "/>
              </Link>
              <Link className="flex-1 text-slate-700 font-semibold  hover:underline truncate" to={`/listing/${listing._id}`}>
              <p >{listing.title || listing.name}</p>
              </Link>
              <div className="flex flex-col items-center">
                <button onClick={() =>handleListingDelete(listing._id)} className="text-red-700 uppercase">Delete</button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase ml-2">Edit</button>
                </Link>
              </div>
          </div>
        ))
       }
       </div>}
    </div>
    
  );
}
