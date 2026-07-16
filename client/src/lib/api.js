import apiClient from '@/api/apiClient';

// ─── Car Service ──────────────────────────────────────────────────────────────
export const carService = {
  /**
   * Fetch all available/sold cars from the public API.
   * Supported params: make, bodyType, condition, year, minPrice, maxPrice, page, pageSize
   */
  getAll: async (params = {}) => {
    // Map client-side filter names to what the backend expects
    const query = {};
    if (params.make && params.make !== 'All') query.make = params.make;
    if (params.bodyType && params.bodyType !== 'All') query.bodyType = params.bodyType;
    if (params.condition && params.condition !== 'All') query.condition = params.condition;
    if (params.year) query.year = params.year;
    if (params.minPrice) query.minPrice = params.minPrice;
    if (params.maxPrice) query.maxPrice = params.maxPrice;
    if (params.page) query.page = params.page;
    if (params.pageSize) query.pageSize = params.pageSize;

    const { data } = await apiClient.get('/cars', { params: query });
    return data.data; // { items: [...], currentPage: ..., totalCount: ... }
  },

  getById: async (id) => {
    const { data } = await apiClient.get(`/cars/${id}`);
    return data.data;
  },

  getFeatured: async () => {
    // Fetch first page of available cars and use up to 4 as featured
    const { data } = await apiClient.get('/cars', { params: { pageSize: 4, page: 1 } });
    return data.data?.items ?? [];
  },
};

// ─── Review Service ───────────────────────────────────────────────────────────
export const reviewService = {
  getAll: async () => {
    const { data } = await apiClient.get('/reviews');
    // returns { items, averageRating, totalApprovedCount, ... }
    return data.data;
  },

  submit: async (reviewData) => {
    const { data } = await apiClient.post('/reviews', reviewData);
    return data;
  },
};

// ─── Enquiry Service ──────────────────────────────────────────────────────────
export const enquiryService = {
  send: async (enquiryData) => {
    const { data } = await apiClient.post('/enquiries', enquiryData);
    return data;
  },
};