import axiosInstance from "./axios";

export const getCampers = async (params = {}) => {
  const response = await axiosInstance.get("/campers", {
    params,
  });
  return response.data;
};

export const getCamperById = async (id) => {
  const response = await axiosInstance.get(`/campers/${id}`);
  return response.data;
};
