import axios from "axios";

export default () => {
  const token = window.localStorage.getItem("auth");
  return axios.create({
    headers: {
      Authorization: `JWT ${token}`,
      "Content-Type": "application/json",
      },
    baseURL: "http://localhost:8081"
  })
};
