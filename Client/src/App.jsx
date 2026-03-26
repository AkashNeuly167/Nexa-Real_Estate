import {BrowserRouter,Routes,Route } from 'react-router-dom'
import Home from './Pages/Home';
import About from './Pages/About';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import Profile from './Pages/Profile';
import Header from './Components/Header.jsx';
import PrivateRoute from './Components/PrivateRoute.jsx';
import CreateListing from './Pages/CreateListing.jsx';
import UpdateListing from './Pages/UpdateListing.jsx';
import Listing from './Pages/Listing.jsx';
import Search from './Pages/Search.jsx';

function App(){
 return(
     <BrowserRouter>
     <Header/>
     <Routes>

        <Route  path='/' element ={<Home />}  />
        <Route  path='/sign-in' element ={<SignIn />}  />
        <Route  path='/sign-up' element ={<SignUp />}  />
        <Route  path='/about' element ={<About />}  />
        <Route  path='/listing/:listingId' element ={<Listing />}  />


        <Route   element={<PrivateRoute />}>
        <Route  path='/profile' element ={<Profile />}  />
        <Route  path='/create-listing' element ={<CreateListing />}  />
        <Route  path='/search' element= {<Search/>}/>
        <Route  path='/update-listing/:listingId' element ={<UpdateListing />}  />
        </Route>
        

     </Routes>
     </BrowserRouter>
 );
}

export default App
