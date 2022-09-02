import axios from "axios";
import {
  removeQueueSuccessMsg,
  startQueueSuccessMsg,
} from "constants/messages";
import { ApiStatusOptions } from "enum/apis";
import {
  MonitorScheduleTypeOptions,
  MonitorSettingOptions,
} from "enum/monitor";
import { ApiDataResponse } from "interfaces/apis";
import { getMonitorByUserId } from "test/data/monitorDb";
import { testAllApisKey, testQueueKey } from "test/data/testKeys";
import { getUser } from "test/data/usersDb";
import { BadRequestError, NotFoundError } from "test/errors";
import { constructDateTime } from "utils/datetime";

type QueueOptions = {
  [key: string]: any;
};

let queueInMemory: QueueOptions = {};

const persist = () =>
  window.localStorage.setItem(testQueueKey, JSON.stringify(queueInMemory));

const load = () => {
  const getQueueKey = window.localStorage.getItem(testQueueKey);
  const _queueKey: string = getQueueKey !== null ? getQueueKey : "";
  Object.assign(queueInMemory, JSON.parse(_queueKey));
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

// START Queue
async function startQueue(userId: string): Promise<string> {
  const monitor = await getMonitorByUserId(userId);

  if (!monitor) {
    const error = new NotFoundError(`No monitor found`);
    throw error;
  }

  if (monitor.monitorSetting !== MonitorSettingOptions.ON) {
    const error = new BadRequestError("Monitor must be on to start");
    throw error;
  }

  const user = await getUser();

  const {
    scheduleType,
    intervalSchedule,
    dateDayOfWeek,
    dateHour,
    dateMinute,
    dateAMOrPM,
  } = monitor;

  if (scheduleType === MonitorScheduleTypeOptions.INTERVAL) {
    queueInMemory[`bullmq:pingApiSchedule-${user.email}`] = {
      jobDetails: `Ping apis for user at ${intervalSchedule}`,
    };
    persist();
  }

  if (scheduleType === MonitorScheduleTypeOptions.DATE) {
    queueInMemory[`bullmq:pingApiSchedule-${user.email}`] = {
      jobDetails: `Ping apis for user at ${dateDayOfWeek} 
      ${dateHour}:${dateMinute} ${dateAMOrPM}`,
    };
    persist();
  }

  type ApiOptions = {
    [key: string]: ApiDataResponse;
  };

  let allApisInMemory: ApiOptions = {};

  const getAllApisKey = window.localStorage.getItem(testAllApisKey);
  const _allApisKey: string = getAllApisKey !== null ? getAllApisKey : "";
  Object.assign(allApisInMemory, JSON.parse(_allApisKey));

  const _allApis = Object.values(allApisInMemory).filter(
    (api) => api.createdBy === userId
  );

  //eslint-disable-next-line
  Object.keys(_allApis).forEach(async (_: string, index: number) => {
    try {
      const resp = await axios.get(_allApis[index].url);

      if (resp && resp.status === 200) {
        _allApis[index].status = ApiStatusOptions.HEALTHY;
        _allApis[index].lastPinged = constructDateTime();
      } else if (!resp) {
        _allApis[index].status = ApiStatusOptions.UNHEALTHY;
        _allApis[index].lastPinged = constructDateTime();
      }
    } catch (error) {
      return error;
    }
  });
  return startQueueSuccessMsg;
}

// REMOVE Queue
async function removeQueue(userId: string): Promise<string> {
  const monitor = await getMonitorByUserId(userId);

  if (!monitor) {
    const error = new NotFoundError(`No monitor found`);
    throw error;
  }

  if (monitor.monitorSetting !== MonitorSettingOptions.OFF) {
    const error = new BadRequestError("Monitor must be off to stop");
    throw error;
  }

  const user = await getUser();

  queueInMemory[`bullmq:pingApiSchedule-${user.email}`] = {};
  persist();

  return removeQueueSuccessMsg;
}

async function resetDB() {
  queueInMemory = {};
  persist();
}

export { startQueue, removeQueue, resetDB };
