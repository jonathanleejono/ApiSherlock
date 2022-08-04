import { createSlice } from "@reduxjs/toolkit";
import { allApisSliceName } from "constants/actionTypes";
import { getAllApis, getAllApisStats } from "features/allApis/allApisThunk";
import { ApiDataResponse, MonthlyApis } from "interfaces/apis";

interface AllApisFiltersState {
  search: string;
  status: string;
  sort: string;
  monitoring: string;
  page: number;
}

interface AllApisStats {
  healthy: number;
  unhealthy: number;
  pending: number;
}

interface AllApisState extends AllApisFiltersState {
  isLoading: boolean;
  allApis: ApiDataResponse[];
  totalApis: number;
  numOfPages: number;
  defaultStats: Partial<AllApisStats>;
  monthlyApis: [MonthlyApis];
  statusOptions: string[];
  sortOptions: string[];
  monitoringOptions: string[];
}

const initialFiltersState: AllApisFiltersState = {
  search: "",
  status: "",
  sort: "Latest",
  monitoring: "",
  page: 1,
};

const initialState: AllApisState = {
  isLoading: true,
  allApis: [],
  totalApis: 0,
  numOfPages: 0,
  defaultStats: { healthy: 0, unhealthy: 0, pending: 0 },
  monthlyApis: [{ date: "", count: 0 }],
  statusOptions: ["healthy", "unhealthy", "pending"],
  sortOptions: ["Latest", "Oldest", "A-Z", "Z-A"],
  monitoringOptions: ["on", "off"],
  ...initialFiltersState,
};

type AllApisOptions = {
  [key: string]: object | number | boolean | string;
};

const allApisSlice = createSlice({
  name: `${allApisSliceName}`,
  initialState,
  reducers: {
    showLoading: (state) => {
      state.isLoading = true;
    },
    hideLoading: (state) => {
      state.isLoading = false;
    },
    handleChange: (state: AllApisOptions, { payload: { name, value } }) => {
      state.page = 1;
      state[name] = value;
    },
    clearFilters: (state) => ({ ...state, ...initialFiltersState }),
    clearState: (state) => ({ ...state, ...initialState }),
    changePage: (state: AllApisOptions, { payload }) => {
      state.page = payload;
    },
    clearAllApisState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getAllApis.pending, (state) => {
      state.isLoading = true;
    }),
      builder.addCase(getAllApis.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        // make sure state + payload items here line up with
        // values returned in backend controllers
        state.allApis = payload.allApis;
        state.totalApis = payload.totalApis;
        state.numOfPages = payload.numOfPages;
      }),
      builder.addCase(getAllApis.rejected, (state) => {
        state.isLoading = false;
      });
    builder.addCase(getAllApisStats.pending, (state) => {
      state.isLoading = true;
    }),
      builder.addCase(getAllApisStats.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.defaultStats = payload.defaultStats;
        state.monthlyApis = payload.monthlyApis;
      }),
      builder.addCase(getAllApisStats.rejected, (state) => {
        state.isLoading = false;
      });
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
