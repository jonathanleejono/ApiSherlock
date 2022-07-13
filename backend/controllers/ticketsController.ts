import Ticket from "../models/Ticket";
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from "../errors/index";
import checkPermissions from "../utils/checkPermissions";
import mongoose from "mongoose";
import moment from "moment";

const createTicket = async (req, res) => {
  const { ticketTitle, ticketDescription, ticketDueDate, ticketAssignees } =
    req.body;

  if (
    !ticketTitle ||
    !ticketDescription ||
    !ticketDueDate ||
    !ticketAssignees
  ) {
    throw new BadRequestError("Please provide all values");
  }

  req.body.createdBy = req.user.userId;

  const ticket = await Ticket.create(req.body);

  res.status(StatusCodes.CREATED).json({ ticket });
};

const getAllTickets = async (req, res) => {
  const {
    ticketStatus,
    ticketPriority,
    ticketType,
    ticketTitle,
    sort,
    search,
  } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
    ticketStatus,
    ticketPriority,
    ticketType,
    ticketTitle,
  };

  // can add more stuff based on condition

  if (ticketStatus && ticketStatus !== "All") {
    queryObject.ticketStatus = ticketStatus;
  }
  if (ticketPriority && ticketPriority !== "All") {
    queryObject.ticketPriority = ticketPriority;
  }
  if (ticketType && ticketType !== "All") {
    queryObject.ticketType = ticketType;
  }
  if (search) {
    queryObject.ticketTitle = { $regex: search, $options: "i" };
  }

  // NO AWAIT

  let result = Ticket.find(queryObject);

  // chain sort conditions

  if (sort === "Latest") {
    result = result.sort("-createdAt");
  }
  if (sort === "Oldest") {
    result = result.sort("createdAt");
  }
  if (sort === "A-Z") {
    result = result.sort("ticketTitle");
  }
  if (sort === "Z-A") {
    result = result.sort("-ticketTitle");
  }

  // setup pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const tickets = await result;

  const totalTickets = await Ticket.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalTickets / limit);

  res.status(StatusCodes.OK).json({ tickets, totalTickets, numOfPages });
};

const updateTicket = async (req, res) => {
  const { id: ticketId } = req.params;
  const { ticketDescription, ticketTitle, ticketDueDate, ticketAssignees } =
    req.body;

  if (
    !ticketTitle ||
    !ticketDescription ||
    !ticketDueDate ||
    !ticketAssignees
  ) {
    throw new BadRequestError("Please provide all values");
  }
  const ticket = await Ticket.findOne({ _id: ticketId });

  if (!ticket) {
    throw new NotFoundError(`No ticket with id :${ticketId}`);
  }

  // check authorization
  checkPermissions(req.user, ticket.createdBy);

  const updatedTicket = await Ticket.findOneAndUpdate(
    { _id: ticketId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(StatusCodes.OK).json({ updatedTicket });
};

const deleteTicket = async (req, res) => {
  const { id: ticketId } = req.params;

  const ticket = await Ticket.findOne({ _id: ticketId });

  if (!ticket) {
    throw new NotFoundError(`No ticket with id :${ticketId}`);
  }

  checkPermissions(req.user, ticket.createdBy);

  await ticket.remove();

  res.status(StatusCodes.OK).json({ msg: "Success! Ticket removed" });
};

// const showStats = async (req, res) => {
//   let statsStatus = await Ticket.aggregate([
//     { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
//     { $group: { _id: "$ticketStatus", count: { $sum: 1 } } },
//   ]);

//   let statsType = await Ticket.aggregate([
//     { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
//     { $group: { _id: "$ticketType", count: { $sum: 1 } } },
//   ]);

//   let statsPriority = await Ticket.aggregate([
//     { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
//     { $group: { _id: "$ticketPriority", count: { $sum: 1 } } },
//   ]);

//   // accumulator, currentValue
//   statsStatus = statsStatus.reduce((acc, curr) => {
//     const { _id: title, count } = curr;
//     acc[title] = count;
//     return acc;
//   }, {});

//   statsType = statsType.reduce((acc, curr) => {
//     const { _id: title, count } = curr;
//     acc[title] = count;
//     return acc;
//   }, {});

//   statsPriority = statsPriority.reduce((acc, curr) => {
//     const { _id: title, count } = curr;
//     acc[title] = count;
//     return acc;
//   }, {});

//   const defaultStats = {
//     Open: statsStatus.Open || 0,
//     High: statsPriority.High || 0,
//     Bug: statsType.Bug || 0,
//   };

//   let monthlyApplications = await Ticket.aggregate([
//     { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
//     {
//       $group: {
//         _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
//         count: { $sum: 1 },
//       },
//     },
//     { $sort: { "_id.year": -1, "_id.month": -1 } },
//     { $limit: 6 },
//   ]);

//   monthlyApplications = monthlyApplications
//     .map((item) => {
//       const {
//         _id: { year, month },
//         count,
//       } = item;

//       const date = moment()
//         .month(month - 1)
//         .year(year)
//         .format("MMM Y");
//       return { date, count };
//     })
//     .reverse();

//   res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
// };

export {
  createTicket,
  deleteTicket,
  getAllTickets,
  updateTicket,
  // showStats
};
