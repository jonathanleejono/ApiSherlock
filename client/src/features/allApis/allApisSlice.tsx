import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getAllApisThunk, getApiStatsThunk } from "./allApisThunk";

const initialFiltersState = {
  search: "",
  status: "",
  statusOptions: ["healthy", "unhealthy", "pending"],
  sort: "Latest",
  sortOptions: ["Latest", "Oldest", "A-Z", "Z-A"],
  monitoring: "",
  monitoringOptions: ["on", "off"],
};

const initialState = {
  isLoading: true,
  allApis: [],
  totalApis: 0,
  numOfPages: 0,
  page: 1,
  monthlyApplications: [],
  defaultStats: {},
  ...initialFiltersState,
};

export const getAllApis: any = createAsyncThunk(
  "allApis/getApis",
  getAllApisThunk
);

export const showStats: any = createAsyncThunk(
  "allApis/showStats",
  getApiStatsThunk
);

const allApisSlice = createSlice({
  name: "allApis",
  initialState,
  reducers: {
    showLoading: (state) => {
      state.isLoading = true;
    },
    hideLoading: (state) => {
      state.isLoading = false;
    },
    handleChange: (state, { payload: { name, value } }) => {
      state.page = 1;
      state[name] = value;
    },
    clearFilters: (state) => ({ ...state, ...initialFiltersState }),
    clearState: (state) => ({ ...state, ...initialState }),
    changePage: (state, { payload }) => {
      state.page = payload;
    },
    clearAllApisState: () => initialState,
  },
  extraReducers: {
    [getAllApis.pending]: (state) => {
      state.isLoading = true;
    },
    [getAllApis.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      // make sure state + payload items here line up with
      // values returned in backend controllers
      state.allApis = payload.allApis;
      state.totalApis = payload.totalApis;
      state.numOfPages = payload.numOfPages;
    },
    [getAllApis.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.dismiss();
      toast.error(payload);
    },
    [showStats.pending]: (state) => {
      state.isLoading = true;
    },
    [showStats.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.defaultStats = payload.defaultStats;
      state.monthlyApplications = payload.monthlyApplications;
    },
    [showStats.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.dismiss();
      toast.error(payload);
    },
  },
});

export const {
  showLoading,
  hideLoading,
  handleChange,
  clearFilters,
  clearState,
  changePage,
  clearAllApisState,
} = allApisSlice.actions;

export default allApisSlice.reducer;
