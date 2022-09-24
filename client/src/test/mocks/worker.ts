import { setupWorker } from "msw";
import { apiHandlers } from "test/mocks/handlers/apiHandlers";
import { monitorHandlers } from "test/mocks/handlers/monitorHandlers";
import { pingHealthCheckHandler } from "test/mocks/handlers/pingHealthCheckHandler";
import { queueHandlers } from "test/mocks/handlers/queueHandlers";
import { userHandlers } from "test/mocks/handlers/userHandlers";

export const worker = setupWorker(
  ...userHandlers,
  ...apiHandlers,
  ...monitorHandlers,
  ...queueHandlers,
  ...pingHealthCheckHandler
);
