import React from "react";

function Listings({ src, propertyName, propertyAddress, percentageLeft }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center md:items-start bg-white p-6 rounded-lg shadow-md">
      <div className="w-full md:w-1/4 mb-4 md:mb-0 h-48 md:h-48 flex-shrink-0">
        <div className="w-full h-full overflow-hidden rounded-lg">
          <img
            className="w-full h-full object-cover"
            src={src}
            alt="Property"
          />
        </div>
      </div>

      <div className="w-full md:w-1/3 mb-4 md:mb-0 text-center md:text-left md:flex md:flex-col justify-evenly md:h-48">
        <h2 className="text-3xl font-semibold mb-2">{propertyName}</h2>
        <h3 className="text-gray-600 text-lg">{propertyAddress}</h3>
      </div>

      <div className="w-full md:w-1/4 text-center md:text-right md:flex md:flex-col justify-center md:h-48 items-center">
        <div
          className="radial-progress text-[#43d854] w-[150px] h-[150px] font-bold"
          style={{
            "--value": `${Math.floor(percentageLeft)}`,
            "--size": "12rem",
            "--thickness": "6px",
          }}
          role="progressbar"
        >
          {percentageLeft.toFixed(0)}
        </div>
      </div>
    </div>
  );
}

export default Listings;
