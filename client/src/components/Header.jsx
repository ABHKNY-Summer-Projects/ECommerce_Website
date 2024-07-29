import React, { useState } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { IoCartOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";

function Header() {
  const [searchInput, setSearchInput] = useState('');

  function recordInput(e){
    setSearchInput(e.target.value)
    console.log(searchInput)
  }
  return (
    <div>
      <div className='flex flex-col md:flex-row justify-between items-center h-20 border-b-2 p-4 md:p-0'>
        <h1 className='md:min-w-40 text-center md:text-end  text-xl font-medium mb-2 md:mb-0'>
            Exclusive
        </h1>

        <div className='flex-1 flex justify-around mx-0 md:mx-16'>
          <Router>
            <div className='flex flex-col md:flex-row'>
              <Link to='/' className='my-1 md:my-0 md:mx-2'>Home</Link>
              <Link to='/' className='my-1 md:my-0 md:mx-2'>Contact</Link>
              <Link to='/' className='my-1 md:my-0 md:mx-2'>About</Link>
              <Link to='/' className='my-1 md:my-0 md:mx-2'>SignUp</Link>
            </div>
          </Router>
        </div>

        <div className='flex justify-around'>
          <div className='flex items-center md:min-w-80 md:mr-20'>
            <input className='bg-gray-100 h-8 border border-r-0 rounded-l pl-2 text-sm focus:outline-none' 
                type="text" 
                value = {searchInput}
                onChange={recordInput}
                placeholder='What are you looking for?' 
            />
            <div className='bg-gray-100 h-8  border border-l-0 rounded-r'>
                <CiSearch className=' w-10 mt-2'/>
            </div>
            <CiHeart className='w-10 h-5'/>
            <IoCartOutline className='w-10 h-5'/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
