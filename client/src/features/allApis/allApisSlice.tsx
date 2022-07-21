import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getAllApisThunk } from "./allApisThunk";

const initialFiltersState = {
  search: "",
  status: "",
  statusOptions: ["healthy", "unhealthy", "pending"],
  sort: "Latest",
  sortOptions: ["Latest", "Oldest", "A-Z", "Z-A"],
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
  getAllApisThunk
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
      toast.loading("Please wait...");
    },
    [getAllApis.fulfilled]: (state) => {
      toast.dismiss();
      state.isLoading = false;
    },
    [getAllApis.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.dismiss();
      toast.error(payload);
    },
    [showStats.pending]: (state) => {
      state.isLoading = true;
    },
    [showStats.fulfilled]: (state) => {
      state.isLoading = false;
      toast.dismiss();
    },
    [showStats.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.defaultStats = payload.defaultStats;
      state.monthlyApplications = payload.monthlyApplications;
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
