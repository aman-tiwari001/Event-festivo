import axios from "axios";
import { server_url } from "../config";


export const getAllProperty = async () => {
  const response = await axios.get(`${server_url}/property/get-all`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });
  return response;
};

export const getSingleProperty = async (id) => {
  const response = await axios.get(`${server_url}/property/get/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });
  return response;
};
