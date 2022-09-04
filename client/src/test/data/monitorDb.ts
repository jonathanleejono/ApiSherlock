import { faker } from "@faker-js/faker";
import {
  MonitorDateAMOrPMOptions,
  MonitorIntervalScheduleOptions,
  MonitorScheduleTypeOptions,
  MonitorSettingOptions,
} from "enum/monitor";
import { MonitorDataResponse, MonitorRequestData } from "interfaces/monitor";
import { generateMockApis } from "test/data/apisDb";
import { testMonitorKey } from "test/data/testKeys";
import { BadRequestError, NotFoundError } from "test/errors";
import { constructDateTime } from "utils/datetime";

type MonitorOptions = {
  [key: string]: MonitorDataResponse;
};

let monitorInMemory: MonitorOptions = {};

// set key "testMonitorKey", set value to monitor = {}
const persist = () =>
  window.localStorage.setItem(testMonitorKey, JSON.stringify(monitorInMemory));

// get by key "testMonitorKey", set monitor = {} to new monitor value
const load = () => {
  const getMonitorKey = window.localStorage.getItem(testMonitorKey);
  const monitorKey: string = getMonitorKey !== null ? getMonitorKey : "";
  Object.assign(monitorInMemory, JSON.parse(monitorKey));
};

const { NODE_ENV, REACT_APP_MSW_DEV } = process.env;

// initialize
if (NODE_ENV === "test" || REACT_APP_MSW_DEV === "on") {
  try {
    load();
  } catch (error) {
    persist();
  }
}

//eslint-disable-next-line
function validateForm(arr: any[]) {
  if (
    arr.every(
      (element) => element !== null && element !== undefined && element !== ""
    )
  ) {
    return true;
  } else return false;
}

// CREATE/POST ONE
async function createMonitor({
  createdBy,
  monitorSetting,
  scheduleType,
  intervalSchedule,
  dateDayOfWeek,
  dateHour,
  dateMinute,
  dateAMOrPM,
}: MonitorRequestData & { createdBy: string }): Promise<MonitorDataResponse> {
  if (
    !validateForm([
      monitorSetting,
      scheduleType,
      intervalSchedule,
      dateDayOfWeek,
      dateHour,
      dateMinute,
      dateAMOrPM,
    ])
  ) {
    const error = new BadRequestError(`Please fill out all values`);
    throw error;
  }

  if (monitorSetting !== MonitorSettingOptions.ON) {
    const error = new BadRequestError(`Monitor must be on`);
    throw error;
  }

  if (monitorInMemory[createdBy]) {
    const error = new BadRequestError(`Error, can only create one monitor`);
    throw error;
  }

  monitorInMemory[createdBy] = {
    _id: faker.datatype.uuid(),
    createdBy,
    monitorSetting,
    scheduleType,
    intervalSchedule,
    dateDayOfWeek,
    dateHour,
    dateMinute,
    dateAMOrPM,
    __v: 0,
    createdAt: constructDateTime(),
    updatedAt: constructDateTime(),
  };

  persist();
  return getMonitorByUserId(createdBy);
}

// GET ONE
async function getMonitorByUserId(
  userId: string
): Promise<MonitorDataResponse> {
  if (monitorInMemory[userId]) {
    return monitorInMemory[userId];
  } else {
    return {
      _id: faker.datatype.uuid(),
      monitorSetting: MonitorSettingOptions.OFF,
      scheduleType: MonitorScheduleTypeOptions.INTERVAL,
      intervalSchedule: MonitorIntervalScheduleOptions.WEEKLY,
      dateDayOfWeek: 0,
      dateHour: 0,
      dateMinute: 0,
      dateAMOrPM: MonitorDateAMOrPMOptions.AM,
      createdBy: userId,
      __v: 0,
      createdAt: constructDateTime(),
      updatedAt: constructDateTime(),
    };
  }
}

// VALIDATE ONE EXISTS
function validateItemExists(userId: string) {
  load();
  if (!monitorInMemory[userId]) {
    const error = new NotFoundError(`No monitor found`);
    throw error;
  }
}

// UPDATE/PATCH ONE
async function updateMonitor(
  userId: string,
  updates: MonitorRequestData
): Promise<MonitorDataResponse> {
  validateItemExists(userId);
  Object.assign(monitorInMemory[userId], updates);
  persist();
  return getMonitorByUserId(userId);
}

// DELETE
async function deleteMonitor(userId: string) {
  validateItemExists(userId);
  const monitor = await getMonitorByUserId(userId);
  if (monitor.monitorSetting !== MonitorSettingOptions.OFF) {
    const error = new BadRequestError(`Error, monitor must be off to delete`);
    throw error;
  }
  delete monitorInMemory[userId];
  persist();
}

// mock monitor, start queue, remove queue

async function resetDB() {
  monitorInMemory = {};
  persist();
}

export {
  createMonitor,
  updateMonitor,
  deleteMonitor,
  getMonitorByUserId,
  generateMockApis,
  resetDB,
};
