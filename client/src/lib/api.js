// API service layer — currently uses mock data.
// Replace each function body with real API calls when backend is ready.
// e.g. import axios from 'axios';
// const api = axios.create({ baseURL: 'https://api.f1deals.com/v1' });

import { MOCK_CARS, MOCK_REVIEWS } from "@/lib/mockData";

export const carService = {
  getAll: async (params = {}) => {
    let cars = [...MOCK_CARS];
    if (params.make) cars = cars.filter(c => c.make === params.make);
    if (params.bodyType) cars = cars.filter(c => c.bodyType === params.bodyType);
    if (params.condition) cars = cars.filter(c => c.condition === params.condition);
    if (params.yearMin) cars = cars.filter(c => c.year >= params.yearMin);
    if (params.yearMax) cars = cars.filter(c => c.year <= params.yearMax);
    if (params.priceMin) cars = cars.filter(c => c.price >= params.priceMin);
    if (params.priceMax) cars = cars.filter(c => c.price <= params.priceMax);
    if (params.search) {
      const q = params.search.toLowerCase();
      cars = cars.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.make.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q)
      );
    }
    return cars;
  },
  getById: async (id) => {
    return MOCK_CARS.find(c => c.id === id) || null;
  },
  getFeatured: async () => {
    return MOCK_CARS.filter(c => !c.sold).slice(0, 4);
  },
};

export const reviewService = {
  getAll: async () => {
    return MOCK_REVIEWS.filter(r => r.approved);
  },
  submit: async (data) => {
    // POST /api/reviews
    console.log("Review submitted:", data);
    return { success: true };
  },
};

export const enquiryService = {
  send: async (data) => {
    // POST /api/enquiries
    console.log("Enquiry sent:", data);
    return { success: true };
  },
};