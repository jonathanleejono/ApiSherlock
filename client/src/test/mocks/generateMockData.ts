import { faker } from "@faker-js/faker";

function randomChoice(options: string[]) {
  const choice = Math.floor(Math.random() * options.length);
  return options[choice];
}

function buildMockUser(overrides?) {
  return {
    _id: faker.datatype.uuid(),
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...overrides,
  };
}

function buildMockApi(overrides?) {
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

// interface Overrides {
//   bookId: string;
// //   book: { id: string };
//   startDate: string;
//   finishDate: string;
//   owner: {ownerId: string};
// }

// function buildListItem(overrides: Overrides) {
//   const {
//     bookId = overrides.book ? overrides.book.id : faker.datatype.uuid(),
//     startDate = faker.date.past(2).getTime(),
//     finishDate = faker.date.between(new Date(startDate), new Date()).getTime(),
//     owner = { ownerId: faker.datatype.uuid() },
//   } = overrides;
//   return {
//     id: faker.datatype.uuid(),
//     // bookId,
//     // ownerId: owner.id,
//     rating: faker.datatype.number(5),
//     notes: faker.datatype.boolean() ? "" : faker.lorem.paragraph(),
//     // finishDate,
//     // startDate,
//     book: buildMockApi({ id: bookId }),
//     ...overrides,
//   };
// }

export {
  buildMockUser,
  // buildListItem,
  buildMockApi,
};
