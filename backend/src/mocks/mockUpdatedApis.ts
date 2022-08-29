import { Api } from "models/ApiDocument";

export const mockUpdatedApis: Partial<Api>[] = [
  {
    url: "https://battery-cellify.herokuapp22.com/ping",
    host: "Heroku",
    status: "unhealthy",
    monitoring: "on",
  },
  {
    // this api doesn't get pinged because monitoring is off
    // so status is "pending"
    url: "https://www.hello-herokuapp2.com/ping",
    host: "Heroku",
    status: "pending",
    monitoring: "off",
  },
  {
    url: "https://www.not1arealwebsitehopefully5.com/ping",
    host: "Heroku",
    status: "unhealthy",
    monitoring: "on",
  },
  {
    url: "https://www.not1arealwebsitehopefully2.com/ping",
    host: "AWS",
    status: "unhealthy",
    monitoring: "on",
  },
  {
    url: "https://www.not1arealwebsitehopefully3.com/ping",
    host: "AWS",
    status: "unhealthy",
    monitoring: "on",
  },
];
