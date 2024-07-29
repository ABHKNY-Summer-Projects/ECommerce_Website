import React from 'react'

function TopHeadline() {
  return (
    <div className='fixed top-0 left-0 right-0 bg-black text-white'>
      <div className='flex justify-around px-4  md:justify-between lg:justify-between items-center md:px-10 lg:px-10'>
        <div className='flex  md:justify-center lg:justify-center flex-grow'>
          <div className='flex mx-1 md:mx-20 lg:mx-20 justify-between'>
            <p className='hidden md:block lg:block text-sm px-5'>Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!</p>
            <p className='px-2 text-sm md:hidden lg:hidden '>Summer Sale Discount - OFF 50%</p>
            <p className='text-sm underline'>ShopNow</p>
          </div>
        </div>
        <div >
          <select className='bg-black text-sm text-center' name="language" id="language">
            <option value="English">English</option>
            <option value="Amharic">Amharic</option>
          </select>
        </div>
      </div>

    </div>
  )
}

export default TopHeadline

