import { setupServer } from "msw/node";
import { handlers as apiHandlers } from "test/mocks/handlers/apiHandlers";
import { handlers as monitorHandlers } from "test/mocks/handlers/monitorHandlers";
import { handlers as queueHandlers } from "test/mocks/handlers/queueHandlers";
import { handlers as userHandlers } from "test/mocks/handlers/userHandlers";

const server = setupServer(
  ...userHandlers,
  ...apiHandlers,
  ...monitorHandlers,
  ...queueHandlers
);

export * from "msw";
export { server };
