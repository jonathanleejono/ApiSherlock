import axios from "axios";
import { ApiStatusOptions } from "enum/apis";
import ApiDocument from "models/ApiDocument";
import UserDocument from "models/UserDocument";
import { Schema } from "mongoose";
import { getDateWithUTCOffset } from "./datetime";

export async function pingApis(
  apis: (ApiDocument &
    Required<{
      _id: Schema.Types.ObjectId;
    }>)[],
  user: UserDocument &
    Required<{
      _id: Schema.Types.ObjectId;
    }>
) {
  Object.keys(apis).forEach(async (_, index: number) => {
    const api = apis[index];

    axios
      .get(api.url)
      .then(() => {
        api.status = ApiStatusOptions.HEALTHY;
        api.lastPinged = getDateWithUTCOffset(user.timezoneGMT);

        api.save();
      })
      .catch(() => {
        api.status = ApiStatusOptions.UNHEALTHY;
        api.lastPinged = getDateWithUTCOffset(user.timezoneGMT);

        api.save();
      });
  });
}
