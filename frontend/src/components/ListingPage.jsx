import React, { useState } from "react";
import axios from "axios";
import { listProperty } from "../apis/userApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ListingPage = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
  });
  const [tokenName, setTokenName] = useState("");
  const [noOfTokens, setNoOfTokens] = useState("");
  const navigate = useNavigate();
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    Promise.all(files.map(convertFileToBase64))
      .then((encodedImages) => setImages(encodedImages))
      .catch((err) => console.error("Error uploading images:", err));
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result.toString());
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (totalPrice <= 0) {
      toast.error("Total price must be greater than 0.");
      return;
    }
  
    if (noOfTokens <= 0) {
      toast.error("Number of tokens must be greater than 0.");
      return;
    }
  

    const propertyData = {
      title,
      desc,
      total_price: totalPrice,
      images,
      location,
      token_name: tokenName,
      no_of_tokens: noOfTokens,
    };

    try {
      const response = await listProperty(propertyData);
      if(response.status === 200) {
        toast.success("Property listed successfully");
        navigate("/")
      }
    } catch (error) {
      toast.error(error);
      console.error("Error listing event:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 mt-[90px] bg-gray-300 rounded-[10px]">
      <h2 className="text-2xl font-bold mb-4 text-black">List a New Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4 text-black">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full h-[35px] bg-white rounded-md px-2 border-black shadow-sm sm:text-sm "
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="mt-1 block w-full h-[35px] bg-white rounded-md px-2 border-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Total Price
          </label>
          <input
            type="number"
            value={totalPrice}
            onChange={(e) => setTotalPrice(e.target.value)}
            className="mt-1 block w-full h-[35px] bg-white rounded-md px-2 border-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
            required
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Images
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-1 block w-full  shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
            <div className="mt-2 grid grid-cols-3 gap-2">
            {images.map((image, index) => (
              <img key={index} src={image} alt={`preview ${index}`} className="w-full h-auto rounded-lg" />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            value={location.address}
            onChange={(e) =>
              setLocation({ ...location, address: e.target.value })
            }
            className="mt-1 block w-full h-[35px] bg-white rounded-md px-2 border-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            type="text"
            value={location.city}
            onChange={(e) => setLocation({ ...location, city: e.target.value })}
            className="mt-1 block w-full h-[35px] bg-white rounded-md px-2 border-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            State
          </label>
          <input
            type="text"
            value={location.state}
            onChange={(e) =>
              setLocation({ ...location, state: e.target.value })
            }
            className="mt-1 block w-full h-[35px] bg-white rounded-md px-2 border-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Country
          </label>
          <input
            type="text"
            value={location.country}
            onChange={(e) =>
              setLocation({ ...location, country: e.target.value })
            }
            className="mt-1 block w-full h-[35px] bg-white rounded-md px-2 border-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Token Name
          </label>
          <input
            type="text"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            className="mt-1 block w-full h-[35px] bg-white rounded-md px-2 border-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Number of Tokens
          </label>
          <input
            type="number"
            value={noOfTokens}
            onChange={(e) => {
              const value = Math.max(0, Number(e.target.value));
              setNoOfTokens(value);
            }}
            className="mt-1 block w-full h-[35px] bg-white rounded-md px-2 border-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
            required
            min={1}
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            List Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default ListingPage;
