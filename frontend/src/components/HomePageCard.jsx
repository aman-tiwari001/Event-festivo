import React from 'react';

function HomeCard({ image, width, height }) {
  return (
    <div className="mb-4">
      <img src={image} alt="" style={{ width, height }} className='rounded-xl object-cover'/>
    </div>
  );
}

export default HomeCard;
