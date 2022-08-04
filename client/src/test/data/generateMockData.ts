import { faker } from "@faker-js/faker";

export const mockUserPassword = "zFtay!5sh?m&&z7190pG";

function randomChoice(options: string[]) {
  const choice = Math.floor(Math.random() * options.length);
  return options[choice];
}

function buildMockUser(overrides?: any) {
  return {
    _id: faker.datatype.uuid(),
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: mockUserPassword,
    ...overrides,
  };
}

function buildMockApi(overrides?: any) {
  return {
    _id: faker.datatype.uuid(),
    url: faker.internet.url(),
    host: randomChoice([
      "AWS",
      "GCP",
      "Azure",
      "Heroku",
      "DigitalOcean",
      "Other",
    ]),
    status: randomChoice(["healthy", "unhealthy", "pending"]),
    lastPinged: "Never pinged",
    monitoring: randomChoice(["on", "off"]),
    createdBy: faker.datatype.uuid(),
    createdAt: Date.now(),
    ...overrides,
  };
}

export { buildMockUser, buildMockApi };
