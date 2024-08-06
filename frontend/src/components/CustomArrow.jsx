import React from 'react';

const CustomArrow = ({ className, style, onClick, direction }) => (
  <div
    className={`${className} bg-gray-800 text-white rounded-full p-2`}
    style={{ ...style, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}
    onClick={onClick}
  >
    {direction === 'left' ? '<' : '>'}
  </div>
);

export const NextArrow = (props) => <CustomArrow {...props} direction="right" />;
export const PrevArrow = (props) => <CustomArrow {...props} direction="left" />;
