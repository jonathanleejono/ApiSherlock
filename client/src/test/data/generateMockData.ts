import { faker } from "@faker-js/faker";
import {
  validApiHostOptions,
  validApiMonitoringOptions,
  validApiStatusOptions,
} from "constants/options/apis";
import { ApiDataResponse } from "interfaces/apis";
import { RegisterUserData } from "interfaces/users";
import { constructDateTime } from "utils/datetime";

export const mockUserPassword = "zFtay!5sh?m&&z7190pG";

function randomChoice(options: string[]): any {
  const choice = Math.floor(Math.random() * options.length);
  return options[choice];
}

function buildMockUser(): RegisterUserData {
  return {
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: mockUserPassword,
    timezoneGMT: -4,
  };
}

function buildMockApi(): ApiDataResponse {
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
  };
}

export { buildMockUser, buildMockApi };
