import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchQuery: '',
  filters: {
    make: '',
    model: '',
    year: '',
    minPrice: '',
    maxPrice: '',
  },
  sortBy: {
    field: 'price', // default sort by price
    direction: 'asc' // default ascending
  },
  currentPage: 1,
  itemsPerPage: 6,
};

export const carsSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

export const { setSearchQuery, setFilters, setSortBy, setCurrentPage } = carsSlice.actions;

export default carsSlice.reducer; 