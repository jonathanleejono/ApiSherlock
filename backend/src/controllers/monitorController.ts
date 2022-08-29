// import { Request, Response } from "express";
// import { StatusCodes } from "http-status-codes";
// import validateUserExists from "utils/validateUserExists";
// import { validateInputKeys } from "utils/validateKeys";
// import { badRequestError, unAuthenticatedError } from "errors/index";
// // import { default as Api, default as ApiCollection } from "models/ApiCollection";
// import Monitor from "models/MonitorCollection";
// import checkPermissions from "utils/checkPermissions";
// import MonitorCollection from "models/MonitorCollection";
// import { validCreateApiKeys } from "constants/keys";

// const createMonitor = async (req: Request, res: Response): Promise<void> => {
//   const { intervalSetting, intervalSchedule, time, dayOfWeek } = req.body;

//   if (!intervalSetting || !intervalSchedule || !time || !dayOfWeek) {
//     throw new BadRequestError("Please provide all values");
//   }

//   // add exception handling -> only one monitor can be created

//   req.body.createdBy = req?.user?.userId;

//   const monitor = await Monitor.create(req.body);

//   res.status(StatusCodes.CREATED).json({ monitor });
// };

// const createMonitor2 = async (req: Request, res: Response): Promise<void> => {
//   //  if monitoring is off
//   //  if there are the right input keys
//   //  if monitor values are missing
//   //  if monitor already exists

//   try {
//     const user = await validateUserExists(req, res);

//     if (!user) {
//       unAuthenticatedError(res, "Invalid Credentials");
//       return;
//     }

//     validateInputKeys(
//       req,
//       res,
//       `Invalid monitor creation, can only input: `,
//       validCreateApiKeys
//     );

//     const { url, host, monitoring } = req.body;

//     if (!url || !host || !monitoring) {
//       badRequestError(res, "Please provide all values");
//       return;
//     }

//     req.body.createdBy = user._id;

//     const monitor = await MonitorCollection.create(req.body);

//     res.status(StatusCodes.CREATED).json(monitor);
//   } catch (error) {
//     console.log(error);
//     badRequestError(res, error);
//     return;
//   }
// };

// // // -------------------------------------------

// // const getMonitor = async (req: Request, res: Response): Promise<any> => {
// //   const monitor = Monitor.findOne({
// //     createdBy: req?.user?.userId,
// //   });

// //   res.status(StatusCodes.OK);

// //   return { monitor };
// // };

// // // ------------------------------------------

// // const updateMonitor = async (req: Request, res: Response): Promise<void> => {
// //   const { id: monitorId } = req.params;

// //   const { intervalSetting, intervalSchedule, time, dayOfWeek } = req.body;

// //   if (!intervalSetting || !intervalSchedule || !time || !dayOfWeek) {
// //     throw new BadRequestError("Please provide all values");
// //   }
// //   const monitor = await Monitor.findOne({ _id: monitorId });

// //   if (!monitor) {
// //     throw new NotFoundError(`No monitor with id :${monitorId}`);
// //   }

// //   // check authorization
// //   checkPermissions(req.user, monitor.createdBy);

// //   const updatedMonitor = await Monitor.findOneAndUpdate(
// //     { _id: monitorId },
// //     req.body,
// //     {
// //       new: true,
// //       runValidators: true,
// //     }
// //   );

// //   res.status(StatusCodes.OK).json({ updatedMonitor });
// // };

// // // ----------------------------------

// // // if monitoring goes from ON to OFF, make api call to delete monitor
// // const deleteMonitor = async (req: Request, res: Response): Promise<void> => {
// //   const { id: monitorId } = req.params;

// //   const monitor = await Monitor.findOne({ _id: monitorId });

// //   if (!monitor) {
// //     throw new NotFoundError(`No monitor with id :${monitorId}`);
// //   }

// //   checkPermissions(req.user, monitor.createdBy);

// //   await monitor.remove();

// //   res.status(StatusCodes.OK).json({ msg: "Success! Monitor removed" });
// // };

// // // ----------------------------------

// // const activateMonitor = async (req: Request, res: Response): Promise<void> => {
// //   // make the get request to array of Apis's URLS <- THE URLS OF THE APIS (ie. api.url) <--- use axios (think of frontend call, but make it to the backend) <- look at Backend assessment axios example
// //   // to know which Apis, find all that have monitoring set to on
// //   // make it based on the time of a monitor <- query to find the monitor (ie. get monitor)

// //   const queryObject = {
// //     createdBy: req?.user?.userId,
// //     monitoring: "on",
// //   };

// //   let result = Api.find(queryObject);

// //   const allApisToMonitor = await result;

// //   const monitor = await Monitor.findOne({
// //     createdBy: req?.user?.userId,
// //   });

// //   const seconds = 1000;
// //   const minutes = seconds * 60;
// //   const hourly = minutes * 60;
// //   const daily = hourly * 24;
// //   const weekly = daily * 7;

// //   if (monitor?.intervalSchedule && monitor?.intervalSchedule === "seconds") {
// //     function doStuff() {
// //       console.log("hello71");
// //     }
// //     setInterval(doStuff, 5000);
// //   }

// //   // Object.keys(allApisToMonitor).forEach((api) => {
// //   //   console.log("yo: ", api);
// //   //   console.log("y2o: ", allApisToMonitor[api].url);
// //   //   // console.log("yo1: ", api.url);
// //   // });

// //   res.json({ allApisToMonitor });
// // };

// // export {
// //   createMonitor,
// //   deleteMonitor,
// //   getMonitor,
// //   updateMonitor,
// //   activateMonitor,
// // };

// // // createMonitor
// // // getMonitor
// // // updateMonitor
// // // activateMonitor
// // // deactivateMonitor <- delete monitor
