import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Carousel.css"; 

const Carousel = ({ events }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  return (
    <div className="flex flex-col h-[78vh] w-full md:w-[50vw] bg-gradient-to-r from-slate-200 to-stone-300 overflow-hidden rounded-2xl ">
      <Slider {...settings} className="overflow-y-hidden p-2">
        {events.images.map((image, index) => (
          <div key={index} className="relative h-[50vh] rounded-2xl">
            <img
              src={image}
              alt={`Property Image ${index + 1}`}
              className="w-full h-[100%] overflow-y-hidden object-cover"
            />
          </div>
        ))}
      </Slider>
      <div className="rounded-3xl m-2 p-4 text-slate-700 overflow-hidden h-[40vh]">
        <h2 className="text-2xl font-bold">{events.title}</h2>
        <div className="overflow-scroll p-2 h-[30vh] ">
          <p className="text-lg font-light h-[90%] p-2 ">
            {events.desc}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
