import api from "../api/axiosInstance";

export async function getNotifications() {
  const response = await api.get("/notifications");
  return response.data.data;
}
