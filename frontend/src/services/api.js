







import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});










export const fetchNotifications = async (page = 1, limit = 10, type = "", search = "") => {
  try {
    const params = { page, limit };
    if (type) params.type = type;
    if (search) params.search = search;

    const response = await api.get("/notifications", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};







export const fetchPriorityNotifications = async (n = 10) => {
  try {
    const response = await api.get("/priority-notifications", {
      params: { n },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching priority notifications:", error);
    throw error;
  }
};

export default api;
