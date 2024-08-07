import { useEffect, useState } from "react";
import EventsCard from "../components/EventsCard";
import { getAllEvents } from "../apis/eventApi";
import { useNavigate } from "react-router-dom";

const Events = ({ setProgress }) => {
  const [eventsList, setEventsList] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getAllProperties = async () => {
      try {
        setProgress(60);
        if (!localStorage.getItem("access_token")) {
          navigate("/login");
          return;
        }
        const response = await getAllEvents();
        setProgress(100);
        console.log(response.data.result);
        setEventsList(response.data.result);
        setFilteredEvents(response.data.result);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };
    getAllProperties();
  }, []);

  useEffect(() => {
    const filteredByPrice = eventsList.filter(
      (item) =>
        parseFloat(item.ticket_price) >= priceRange.min &&
        parseFloat(item.ticket_price) <= priceRange.max
    );

    const filteredByCategory = category
      ? filteredByPrice.filter((item) => item.category === category)
      : filteredByPrice;

    const filteredBySearch = filteredByCategory.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredEvents(filteredBySearch);
  }, [eventsList, priceRange, category, searchTerm]);

  return (
    <div className="bg-base-100 ">
      <div className="flex flex-wrap mt-[90px] p-5 rounded-md shadow-md text-black items-center">
        {/* Price Range Filter */}
        <div className="w-full sm:w-[25%] text-white mb-4 sm:mb-0 sm:mr-4">
          <label className="block text-white mb-2">Price Range:</label>
          <div className="flex items-center mt-2">
            <input
              type="range"
              min="0"
              max="1000000"
              step="30000"
              value={priceRange.max}
              onChange={(e) =>
                setPriceRange({ ...priceRange, max: parseInt(e.target.value) })
              }
              className="w-1/2 mr-2"
            />
            <span>${priceRange.max}</span>
          </div>
        </div>

        {/* Category Filter */}
        <div className="w-full sm:w-[25%] mb-4 sm:mb-0 sm:mr-4">
          <label className="block text-white mb-2">Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
          >
            <option value="">All</option>
            <option value="Movie">Movie</option>
            <option value="Concert">Concert</option>
            <option value="Festival">Festival</option>
            <option value="Sports">Sports</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="w-full sm:w-[20%]">
          <label className="block text-white mb-2">Search:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="w-full p-2 border border-gray-300 rounded-md text-primary bg-gray-100"
          />
        </div>
        <div className="w-full sm:w-[25%] mb-4 sm:mb-0 sm:ml-4">
          <label className="block text-white mb-2">Date:</label>
          <input
            className="bg-white text-black rounded-lg p-2"
            type="date"
            name=""
            id=""
          />
        </div>
      </div>

      <div className="card-section justify-center bg-base-100 sm:justify-between px-5 mt-5">
        {filteredEvents.length === 0 ? (
          <p>No events found.</p>
        ) : (
          filteredEvents.map((events) => (
            <EventsCard key={events._id} events={{ ...events }} />
          ))
        )}
      </div>
    </div>
  );
};

export default Events;
