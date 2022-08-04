import { setupServer } from "msw/node";
import { handlers } from "test/mocks/handlers";

const server = setupServer(...handlers);

export * from "msw";
export { server };
