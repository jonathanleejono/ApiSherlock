import { faker } from "@faker-js/faker";
import {
  apiHostOptions,
  apiMonitoringOptions,
  apiStatusOptions,
} from "constants/options";
import { RegisterUserData } from "interfaces/users";
import { constructDateTime } from "utils/datetime";

export const mockUserPassword = "zFtay!5sh?m&&z7190pG";

function randomChoice(options: string[]) {
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

function buildMockApi() {
  return {
    _id: faker.datatype.uuid(),
    url: faker.internet.url(),
    host: randomChoice(apiHostOptions),
    status: randomChoice(apiStatusOptions),
    lastPinged: "Never pinged",
    monitoring: randomChoice(apiMonitoringOptions),
    createdBy: faker.datatype.uuid(),
    createdAt: constructDateTime(),
    updatedAt: constructDateTime(),
    __v: 0,
  };
}

export { buildMockUser, buildMockApi };
