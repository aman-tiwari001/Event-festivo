import axios from "axios";
import { server_url } from "../config";
import toast from "react-hot-toast";

const public_address = localStorage.getItem("public_address");

export const listEvent = async (eventData) => {
  const response = await axios.post(
    `${server_url}/user/list-event`,
    eventData,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );
  return response;
};

export const getUserDetails = async () => {
  const response = await axios.get(`${server_url}/user/details`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });
  return response;
};

export const purchaseEventTicket = async (eventId, no_of_tickets) => {
  const response = await axios.post(
    `${server_url}/user/purchase/ticket/${eventId}`,
    {no_of_tickets: no_of_tickets },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );
  return response;
};

export const fundAccountWithTestDiam = async () => {
  const response = await axios.get(`${server_url}/user/fund-account`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });
  return response.data;
};

export const handlePayment = async (amount, receiverPublicKey) => {
  try {
    const resp = await axios.post(
      `${server_url}/user/make-payment`,
      {
        receiverPublicKey,
        amount: amount.toString() + ".0000000",
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
    console.log(resp.data);
    toast.success("Payment Successful");
    return resp;
  } catch (error) {
    console.error(error);
    toast.error("Payment Failed. Please try again.");
  }
};

export const getDiamAccountTransactions = async () => {
  try {
    const resp = await axios.get(
      `https://diamtestnet.diamcircle.io/accounts/${public_address}/transactions`
    );
    return resp.data;
  } catch (error) {
    console.log("Error fetching transactions: ", error);
    toast.error("Error fetching transactions");
  }
};
