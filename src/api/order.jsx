import { post, get } from "./index";

export const createOrder = async (data) => {
  return post("/orders", data);
};

export const getOrders = async () => {
  return get("/orders");
};

export const getProvinces = async () => {
  return get("/orders/provinces");
}

export const getDistricts = async (provinceId) => {
  return get(`/orders/districts/${provinceId}`);
}

export const getWards = async (districtId) => {
  return get(`/orders/wards/${districtId}`);
}