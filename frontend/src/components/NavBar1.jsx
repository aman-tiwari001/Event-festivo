import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { RiAccountPinCircleLine } from "react-icons/ri";
import { Horizon } from "diamante-sdk-js";
import toast from "react-hot-toast";
import { fundAccountWithTestDiam } from "../apis/userApi";
import { BsTicketPerforated } from "react-icons/bs";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoWalletOutline } from "react-icons/io5";
import { FaBitcoin } from "react-icons/fa";

const navbarItems = [
  {
    icon: <BsTicketPerforated className="text-lg md:text-[25px] z-50" />,
    label: "Buy",
    link: "/",
  },
  {
    icon: <IoIosAddCircleOutline className="text-lg md:text-[25px] z-50" />,
    label: "List",
    link: "/listing",
  },
  {
    icon: <RiAccountPinCircleLine className="text-lg md:text-[25px] z-50" />,
    label: "Account",
    link: "/dashboard",
  },
];

function Navbar1({ setProgress }) {
  const server = new Horizon.Server("https://diamtestnet.diamcircle.io");
  const location = useLocation();
  const [selected, setSelected] = useState("");
  const [balance, setBalance] = useState(0);

  const navigate = useNavigate();

  const fetchDiamBalance = async () => {
    try {
      const response = await server.loadAccount(
        localStorage.getItem("public_address")
      );
      setBalance(response.balances[0].balance);
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    }
  };
  const publicAddress = localStorage.getItem("public_address");
  const addressLen = publicAddress ? publicAddress.length : 0;

  const handleItemClick = (label) => {
    if (label === "Buy" || label === "Sell") {
      setSelected(label);
    }
  };

  const handleFundAcc = async () => {
    try {
      setProgress(40);
      const resp = await fundAccountWithTestDiam();
      setProgress(100);
      console.log(resp);
      toast.success("Account funded successfully!");
    } catch (error) {
      toast.error("Failed to fund account!");
      console.log("Failed to fund account:", error);
      setProgress(100);
    }
    setBalance("Fetching...");
  };

  useEffect(() => {
    fetchDiamBalance();
  }, [balance]);

  return (
    <>
      {location.pathname !== "/login" && location.pathname !== "/signup" && (
        <div className="w-[100%] h-[80px] flex fixed top-0 mb-[100px] items-center justify-between px-4 md:px-8 backdrop-blur z-20">
          <Link to="/">
            <div className="flex items-center ml-[45px]">
              <img
                src="/eflogo.png"
                alt="logo"
                className="object-cover"
                width={70}
              />
              <h2 className="text-lg md:text-[25px] font-bold shadow-xl text-transparent bg-clip-text bg-gradient-to-l from-purple-600 to-pink-500 ml-2 md:ml-4 hidden md:block overflow-hidden">
                EventÓfestivo
              </h2>
            </div>
          </Link>

          <div className="text-black flex items-center gap-2 p-1">
            {publicAddress && (
              <div
                onClick={() => {
                  navigator.clipboard.writeText(publicAddress);
                  toast.success("Public address copied to clipboard!", {
                    style: {
                      background: "#7065F0",
                      color: "white",
                    },
                  });
                }}
                className="cursor-pointer hidden sm:flex items-center p-2 bg-gray-300 rounded-lg shadow-sm "
              >
                <IoWalletOutline size={24} className="mr-1" />
                <span className="text-sm md:text-base">
                  {publicAddress.slice(0, 5) +
                    "..." +
                    publicAddress.slice(addressLen - 5)}
                </span>
              </div>
            )}

            <div className="flex items-center p-2 gap-x-2 bg-gray-300 rounded-md shadow-sm">
              <img src="/diam.png" width={30} alt="" />
              <p className="text-sm md:text-base">
                {Number.parseFloat(balance).toFixed(2)} DIAMS
              </p>
            </div>
          </div>

          <div onClick={handleFundAcc} className="flex gap-3 items-center ml-2">
            <div className="flex items-center gap-2 text-white md:px-4 md:py-2 bg-green-500 hover:bg-green-700 rounded-lg transition-all cursor-pointer p-2">
              <FaBitcoin size={24} />
              <h2 className="font-bold hidden md:block text-sm md:text-base">
                Fund
              </h2>
            </div>
          </div>

          <div
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="flex gap-3 items-center ml-2"
          >
            <div className="flex items-center gap-2 text-white md:px-4 md:py-2 bg-[#f91818] hover:bg-[#b01313] rounded-md transition-all cursor-pointer p-2">
              <FiLogOut size={24} className="md:text-[25px] " />
              <h2 className="font-bold hidden md:block text-sm md:text-base">
                Logout
              </h2>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar1;
