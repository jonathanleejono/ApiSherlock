import { setupServer } from "msw/node";
import { apiHandlers } from "test/mocks/handlers/apiHandlers";
import { monitorHandlers } from "test/mocks/handlers/monitorHandlers";
import { pingHealthCheckHandler } from "test/mocks/handlers/pingHealthCheckHandler";
import { queueHandlers } from "test/mocks/handlers/queueHandlers";
import { userHandlers } from "test/mocks/handlers/userHandlers";

const server = setupServer(
  ...userHandlers,
  ...apiHandlers,
  ...monitorHandlers,
  ...queueHandlers,
  ...pingHealthCheckHandler
);

export * from "msw";
export { server };
