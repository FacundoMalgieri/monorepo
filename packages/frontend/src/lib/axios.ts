import axios from "axios";

import ENV from "./constants/env.constants";

const instance = axios.create({
  baseURL: ENV.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
