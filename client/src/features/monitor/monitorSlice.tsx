import { createSlice } from "@reduxjs/toolkit";
import { monitorSliceName } from "constants/actionTypes";
import {
  validMonitorDateDayOfWeekOptions,
  validMonitorDateHourOptions,
  validMonitorDateMinuteOptions,
} from "constants/options/monitor";
import {
  MonitorDateAMOrPMOptions,
  MonitorDateDayOfWeekOptions,
  MonitorIntervalScheduleOptions,
  MonitorScheduleTypeOptions,
  MonitorSettingOptions,
} from "enum/monitor";
import {
  createMonitor,
  deleteMonitor,
  editMonitor,
  getMonitor,
} from "features/monitor/monitorThunk";
import { MonitorRequestData } from "interfaces/monitor";

interface MonitorState extends MonitorRequestData {
  isLoading: boolean;
  monitorSetting: MonitorSettingOptions;
}

const initialState: MonitorState = {
  isLoading: false,
  monitorSetting: MonitorSettingOptions.OFF,
  scheduleType: MonitorScheduleTypeOptions.INTERVAL,
  intervalSchedule: MonitorIntervalScheduleOptions.WEEKLY,
  dateDayOfWeek: validMonitorDateDayOfWeekOptions[0],
  dateHour: validMonitorDateHourOptions[0],
  dateMinute: validMonitorDateMinuteOptions[0],
  dateAMOrPM: MonitorDateAMOrPMOptions.AM,
};

type MonitorOptions = {
  [key: string]: Partial<MonitorState>;
};

const monitorSlice = createSlice({
  name: `${monitorSliceName}`,
  initialState,
  reducers: {
    handleMonitorInput: (
      state: MonitorOptions,
      { payload: { name, value } }
    ) => {
      state[name] = value;
    },
    resetMonitorState: () => ({
      ...initialState,
    }),
    clearMonitorForm: () => ({
      ...initialState,
      monitorSetting: MonitorSettingOptions.ON,
    }),
    setEditMonitor: (state, { payload }) => ({ ...state, ...payload }),
  },
  extraReducers: (builder) => {
    builder.addCase(createMonitor.pending, (state) => {
      state.isLoading = true;
    }),
      builder.addCase(createMonitor.fulfilled, (state) => {
        state.isLoading = false;
      }),
      builder.addCase(createMonitor.rejected, (state) => {
        state.isLoading = false;
      });
    builder.addCase(getMonitor.pending, (state) => {
      state.isLoading = true;
    }),
      builder.addCase(getMonitor.fulfilled, (state, { payload }) => {
        const {
          monitorSetting,
          scheduleType,
          intervalSchedule,
          dateDayOfWeek,
          dateHour,
          dateMinute,
          dateAMOrPM,
        } = payload;
        state.isLoading = false;
        state.monitorSetting = monitorSetting;
        state.scheduleType = scheduleType;
        state.intervalSchedule = intervalSchedule;
        state.dateDayOfWeek = MonitorDateDayOfWeekOptions[dateDayOfWeek];
        //+1 because the backend has hours 0 to 11, but frontend is 1 to 12
        state.dateHour = dateHour + 1;
        state.dateMinute = dateMinute;
        state.dateAMOrPM = dateAMOrPM;
      }),
      builder.addCase(getMonitor.rejected, (state) => {
        state.isLoading = false;
      });
    builder.addCase(editMonitor.pending, (state) => {
      state.isLoading = true;
    }),
      builder.addCase(editMonitor.fulfilled, (state) => {
        state.isLoading = false;
      }),
      builder.addCase(editMonitor.rejected, (state) => {
        state.isLoading = false;
      });
    builder.addCase(deleteMonitor.pending, (state) => {
      state.isLoading = true;
    }),
      builder.addCase(deleteMonitor.fulfilled, (state) => {
        state.isLoading = false;
      }),
      builder.addCase(deleteMonitor.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  resetMonitorState,
  setEditMonitor,
  handleMonitorInput,
  clearMonitorForm,
} = monitorSlice.actions;

export default monitorSlice.reducer;
