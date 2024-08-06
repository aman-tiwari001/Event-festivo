import React from 'react';
import HomeCard from '../components/HomePageCard';

function Home() {
  return (
    <div className="w-[100vw] p-4 mt-[90px]">
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
        <HomeCard image="https://via.placeholder.com/300x150" width="100%" height="150px" />
        <HomeCard image="https://via.placeholder.com/300x200" width="100%" height="200px" />
        <HomeCard image="https://via.placeholder.com/300x250" width="100%" height="250px" />
        <HomeCard image="https://via.placeholder.com/300x300" width="100%" height="300px" />
        <HomeCard image="https://via.placeholder.com/300x350" width="100%" height="350px" />
        <HomeCard image="https://via.placeholder.com/300x400" width="100%" height="400px" />
        <HomeCard image="https://via.placeholder.com/300x450" width="100%" height="450px" />
        <HomeCard image="https://via.placeholder.com/300x500" width="100%" height="500px" />
        <HomeCard image="https://via.placeholder.com/300x550" width="100%" height="550px" />
        <HomeCard image="https://via.placeholder.com/300x600" width="100%" height="600px" />
        <HomeCard image="https://via.placeholder.com/300x650" width="100%" height="650px" />
        <HomeCard image="https://via.placeholder.com/300x700" width="100%" height="700px" />
      </div>
    </div>
  );
}

export default Home;
