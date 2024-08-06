import { useEffect, useState } from "react";
import MyInvestment from "../components/MyInvestment";
import Transaction from "../components/MyTransaction";
import Listings from "../components/MyListings";
import { getDiamAccountTransactions, getUserDetails } from "../apis/userApi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function DashBoard({ setProgress }) {
  const [activeTab, setActiveTab] = useState("My Bookings");
  const [user, setUser] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        setProgress(45);
        setLoading(true);
        const response = await getUserDetails();
        setProgress(100);
        setUser(response.data.result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setLoading(false);
        setProgress(100);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (activeTab === "My Transactions") {
      toast.promise(
        getDiamAccountTransactions().then((transactions) =>
          setTransactions(transactions._embedded.records)
        ),
        {
          loading: "Fetching Transactions from chain...",
          success: "Transactions fetched",
          error: "Failed to load Transactions",
        }
      );
    }
  }, [activeTab]);

  return (
    <div className="bg-white w-full h-screen example mt-[100px]">
      {!loading && (
        <div className="p-6 h-[100vh] bg-white overflow-auto">
          <h1 className="text-2xl font-bold mb-4 text-[#00B29F]">
            <p className="text-white">
              Hello,{" "}
              <span className="text-[#00B29F]">{user.username || "Guest"}</span>
            </p>
          </h1>
          <div className="flex space-x-4">
            <button
              className={`py-2 px-4 ${
                activeTab === "My Bookings"
                  ? "bg-[#00B29F] text-white rounded-[6px]"
                  : "bg-[#9c9c9c] text-white rounded-[6px]"
              }`}
              onClick={() => handleTabClick("My Bookings")}
            >
              My Bookings
            </button>
            <button
              className={`py-2 px-4 ${
                activeTab === "My Listings"
                  ? "bg-[#00B29F] text-white rounded-[6px]"
                  : "bg-[#9c9c9c] text-white rounded-[6px]"
              }`}
              onClick={() => handleTabClick("My Listings")}
            >
              My Listings
            </button>
            <button
              className={`py-2 px-4 ${
                activeTab === "My Transactions"
                  ? "bg-[#00B29F] text-white rounded-[6px]"
                  : "bg-[#9c9c9c] text-white rounded-[6px]"
              }`}
              onClick={() => handleTabClick("My Transactions")}
            >
              My Transactions
            </button>
          </div>
          <div className="mt-4 mb-4">
            {activeTab === "My Bookings" && (
              <div className="flex flex-col gap-2">
                {user.my_bookings.map((bookings, index) => (
                  <Link to={`/details/${bookings.event._id}`} key={index}>
                    <MyInvestment
                      key={bookings.event._id}
                      src={bookings.event.images[0]}
                      propertyName={bookings.event.title}
                      propertyAddress={bookings.event.location.address}
                      share_per={bookings.tickets_bought}
                      total_price={bookings.event.ticket_price}
                    />
                  </Link>
                ))}
              </div>
            )}

            {activeTab === "My Listings" && (
              <div className="flex flex-col gap-2">
                {user.my_listings.map((events, index) => (
                  <Link to={`/details/${events._id}`} key={index}>
                    <Listings
                      key={events._id}
                      src={events.images[0]}
                      propertyName={events.title}
                      propertyAddress={events.location.address}
                      percentageLeft={(events.available_tickets)}
                      total_price={events.ticket_price}
                    />
                  </Link>
                ))}
              </div>
            )}
            {activeTab === "My Transactions" && transactions.length ? (
              <>
                <p className="text-gray-600">
                  Transaction list for your account fetched from Diamante chain.
                </p>
                <table className="min-w-full rounded-xl text-black border-2 border-black">
                  <thead>
                    <tr className="border-b-2 border-black text-black">
                      <th className="border-b-2 border-black p-2 text-left">
                        Date
                      </th>
                      <th className="border-b-2 border-black p-2 text-left">
                        Hash
                      </th>
                      <th className="border-b-2 border-black p-2 text-left">
                        Source Account
                      </th>
                      <th className="border-b-2 border-black p-2 text-left">
                        Fee
                      </th>
                      <th className="border-b-2 border-black p-2 text-left">
                        Success
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((item, indx) => (
                      <tr
                        key={indx}
                        className={`border-t border-black ${
                          indx % 2 === 0 ? "bg-indigo-300" : "bg-white"
                        }`}
                      >
                        <td className="border-t border-black p-2">
                          {new Date(item.created_at).toLocaleDateString()}
                        </td>
                        <td
                          onClick={() => {
                            navigator.clipboard.writeText(item.hash);
                            toast.success("Copied to clipboard!");
                          }}
                          className="border-t border-black p-2 cursor-pointer"
                        >
                          {item.hash.slice(0, 7) +
                            "..." +
                            item.hash.slice(item.hash.length - 7)}
                        </td>
                        <td
                          onClick={() => {
                            navigator.clipboard.writeText(item.source_account);
                            toast.success("Copied to clipboard!");
                          }}
                          className="border-t border-black p-2 cursor-pointer"
                        >
                          {item.source_account}
                        </td>
                        <td className="border-t border-black p-2">
                          {item.fee_charged}
                        </td>
                        <td className="border-t border-black p-2">
                          {item.successful ? "✅" : "❌"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              activeTab === "My Transactions" && (
                <p className="text-black text-center text-xl mx-auto my-16">
                  No Transactions found!
                </p>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DashBoard;
