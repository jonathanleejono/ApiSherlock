import { setupWorker } from "msw";
import { handlers } from "test/mocks/handlers/userHandlers";

export const worker = setupWorker(...handlers);
