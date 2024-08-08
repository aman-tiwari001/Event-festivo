import React, { useState } from "react";
import { BiAddToQueue, BiBookAdd, BiHome, BiPlusCircle, BiSolidDashboard } from "react-icons/bi";
import { FiMenu, FiX } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";

const CollapsibleSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/login" && location.pathname !== "/signup" && (
        <div className="relative z-50">
          <button
            className="fixed top-4 left-4 z-20 p-2 bg-blue-00 text-pink-400 scale-110 rounded-md"
            onClick={toggleSidebar}
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          <div
            className={`fixed top-0 left-0 h-full bg-base-300 overflow-auto no-scrollbar text-white transition-transform transform ${
              isOpen ? "translate-x-0" : "-translate-x-full"
            } w-64 shadow-lg z-10`}
          >
            <div className="flex flex-col space-y-4 p-4">
              <h3 className="text-center font-semibold mt-4 mb-4 text-Pink">
                Menu
              </h3>
              <Link to={"/"}>
                <button className="btn-Pink w-full flex items-center gap-5 text-xl">
                  <BiHome />
                  Home</button>
              </Link>
              <Link to={"/listing"}>
                <button className="btn-Pink w-full flex items-center gap-5 text-xl">
                  <BiPlusCircle />
                  List Event</button>
              </Link>
              <Link to={"/dashboard"}>
                <button className="btn-Pink w-full flex items-center gap-5 text-xl">
                  <BiSolidDashboard />
                  DashBoard</button>
              </Link>
            </div>
          </div>
          <div
            className={`fixed top-0 left-0 h-full w-full bg-black bg-opacity-80 z-[9] transition-opacity ${
              isOpen ? "opacity-50" : "opacity-0 pointer-events-none"
            }`}
            onClick={toggleSidebar}
          />
        </div>
      )}
    </>
  );
};

export default CollapsibleSidebar;
