import React, { useEffect, useState } from "react";
import Carousel from "../components/Carousel";
import { getSingleEvent } from "../apis/eventApi";
import { useNavigate, useParams } from "react-router-dom";
import { handlePayment, purchaseEventTicket } from "../apis/userApi";
import toast from "react-hot-toast";

const BuyingPage = ({ setProgress }) => {
  const { id } = useParams();
  const totalEventsPrice = 200;
  const totalTokens = 10;
  const [ticketCount, setTicketCount] = useState('');
  const [percentage, setPercentage] = useState(0);
  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setProgress(37);
        const response = await getSingleEvent(id);
        setEvents(response.data.result);
        console.log(events);
        setProgress(100);
      } catch (error) {
        setError("Failed to fetch events details.");
        console.error(error);
        setProgress(100);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [id]);

  const handleTokenChange = (e) => {
    const value = Math.max(
      0,
      Math.min(events.available_tickets, parseInt(e.target.value) || 0)
    );
    setTicketCount(value);
    setPercentage((value / events.available_ticktes) * 100);
  };

  const handleBuy = async () => {
    if (ticketCount <= 0) {
      toast.error("Please enter a valid number of tokens to buy.");
      return;
    }

    try {
      setProgress(40);
      const no_of_tickets = ticketCount;
      console.log(no_of_tickets);
      const resp = await handlePayment(ticketCount * events.ticket_price, events.owner.public_address);
      if(resp.status !== 200) {
        return;
      }
      setProgress(60);
      await purchaseEventTicket(id, no_of_tickets);
      setProgress(100);
      toast.success("💰 Ticket tranferred to wallet successfully");
      setTicketCount(0);
      setPercentage(0);
      navigate("/"); 
    } catch (error) {
      toast.error("Transaction failed");
      console.error(error);
      setProgress(100);
      setError(error);
    }
  };

  if (loading) return <div>Loading...</div>;

  const isPurchasePossible = events && events.available_tickets > 0;

  return (
    <div className="mt-[80px] gap-3 flex flex-wrap w-screen h-auto overflow-y-hidden p-4">
      <Carousel className="w-full md:w-1/2" events={events} />

      <div className="bg-gradient-to-r buyingbox from-slate-200 to-stone-300 w-full md:w-[45vw] h-min rounded-2xl flex flex-col p-2 shadow-md">
        <div className="bg-white p-4 flex flex-col gap-2 rounded-2xl">
          <h3 className="text-2xl font-bold text-center text-black mb-2">
            Purchase Ticket
          </h3>
          <h4 className="text-lg text-center font-semibold text-gray-800 mb-4">
            (Buying using DIAM tokens)
          </h4>
          <p className="text-gray-700">
            <strong>Name of Token:</strong> {events.token_name}
          </p>
          <p className="text-gray-700">
            <strong>Total Ticktes:</strong> {events.total_tickets}
          </p>
          <p className="text-gray-700">
            <strong>Ticket Price:</strong> {events.ticket_price} DIAMS
          </p>
          <p className="text-gray-700">
            <strong>Available Tokens:</strong> {events.available_tickets}
          </p>
          <p className="text-gray-700">
            <strong>Tokens Left After Transaction:</strong>{" "}
            {events.available_tickets - ticketCount}
          </p>
        </div>
        <div className="flex flex-col pt-3 px-1 gap-1">
          <h3 className="text-black">Number of Tickets to Buy</h3>
          <input
            type="number"
            min="0"
            max={events.available_tickets}
            value={ticketCount}
            onChange={handleTokenChange}
            className="border-2 bg-white border-white text-slate-800 font-mono font-medium rounded-md p-2"
            placeholder="Enter number of tokens to buy"
          />
          {isPurchasePossible ? (
            <button
              className="text-white mt-4 font-medium text-xl px-4 py-3 bg-[#7065F0] hover:bg-[#d7d4fc] rounded-[10px] hover:text-[#7065F0] transition-all"
              onClick={handleBuy}
            >
              <h1>PURCHASE</h1>
            </button>
          ) : (
            <div className="bg-red-500 mt-4 text-center text-white px-4 py-2 rounded-[12px]">
              <h1>Purchase is not available for this event.</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyingPage;
