import { faker } from "@faker-js/faker";
import {
  validApiHostOptions,
  validApiMonitoringOptions,
  validApiStatusOptions,
} from "constants/options/apis";
import {
  validMonitorDateAMorPMOptions,
  validMonitorDateDayOfWeekOptions,
  validMonitorDateHourOptions,
  validMonitorDateMinuteOptions,
} from "constants/options/monitor";
import {
  MonitorIntervalScheduleOptions,
  MonitorScheduleTypeOptions,
  MonitorSettingOptions,
} from "enum/monitor";
import { ApiDataResponse } from "interfaces/apis";
import { MonitorDataResponse } from "interfaces/monitor";
import { RegisterUserData } from "interfaces/users";
import { constructDateTime } from "utils/datetime";

export const mockUserPassword = "zFtay!5sh?m&&z7190pG";

//eslint-disable-next-line
function randomChoice(options: string[]): any {
  const choice = Math.floor(Math.random() * options.length);
  return options[choice];
}

function buildMockUser(overrides: Partial<RegisterUserData>): RegisterUserData {
  return {
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: mockUserPassword,
    timezoneGMT: -4,
    ...overrides,
  };
}

function buildMockApi(overrides: Partial<ApiDataResponse>): ApiDataResponse {
  return {
    _id: faker.datatype.uuid(),
    url: faker.internet.url(),
    host: randomChoice(validApiHostOptions),
    status: randomChoice(validApiStatusOptions),
    lastPinged: "Never pinged",
    monitoring: randomChoice(validApiMonitoringOptions),
    createdBy: faker.datatype.uuid(),
    createdAt: constructDateTime(),
    updatedAt: constructDateTime(),
    __v: 0,
    ...overrides,
  };
}

function buildMockMonitor(
  overrides: Partial<MonitorDataResponse>
): MonitorDataResponse {
  return {
    _id: faker.datatype.uuid(),
    monitorSetting: MonitorSettingOptions.ON,
    scheduleType: MonitorScheduleTypeOptions.DATE,
    intervalSchedule: MonitorIntervalScheduleOptions.WEEKLY,
    dateDayOfWeek: validMonitorDateDayOfWeekOptions[0],
    dateHour: validMonitorDateHourOptions[0],
    dateMinute: validMonitorDateMinuteOptions[0],
    dateAMOrPM: validMonitorDateAMorPMOptions[0],
    createdBy: faker.datatype.uuid(),
    createdAt: constructDateTime(),
    updatedAt: constructDateTime(),
    __v: 0,
    ...overrides,
  };
}

export { buildMockUser, buildMockApi, buildMockMonitor };
