import axios from "axios";
import { server_url } from "../config";


export const getAllEvents = async () => {
  const response = await axios.get(`${server_url}/events/get-all`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });
  return response;
};

export const getSingleEvent = async (id) => {
  const response = await axios.get(`${server_url}/events/get/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });
  return response;
};
