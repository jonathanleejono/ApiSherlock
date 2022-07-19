const moment = require("moment");

console.log("yo1");

function nextDay(x) {
  let now = new Date();
  now.setDate(now.getDate() + ((x + (7 - now.getDay())) % 7));
  return now;
}

// the next monday
const result = nextDay(1);

const newNow = new Date();

const result2 = result - newNow;
const result3 = result2 / 1000;
const result4 = result3 / 60;
const result5 = result4 / 60;
const result6 = result5 / 24;

// setTimeout to the milliseconds, and then setInterval for 7 days afterwards

console.log("22: ", result);
console.log("2233: ", result2);
console.log("secs: ", result3);
console.log("mins: ", result4);
console.log("hrs: ", result5);
console.log("days: ", result6);

let test = moment().startOf("isoWeek").add(1, "week");
let test2 = test.format("MMM Do, YYYY, h");

console.log("test: ", test);
console.log("test2: ", test2);

let createdAt = new Date();
console.log("today0: ", new Date());
console.log("today012121221zz: ", Date.now());
console.log("day of week: ", new Date().getDay());

let date = moment(createdAt);
date = date.format("MMM Do, YYYY, h");

// let dateTimeTest = "Monday 8:00PM";

// let date2 = moment(dateTimeTest);
// date2 = date2.format("MMM Do, YYYY, h");

// console.log("THE DATE: ", date);
// // console.log("THE DATE2: ", date2);

// console.log("today2: ", new Date().getHours());
// console.log("today3: ", new Date().getTime());

// let dateArray = "1/1/1912".split("/");
// const okay = new Date(dateArray[2], dateArray[1], dateArray[0]);
// console.log("okay: ", okay);

// // clearInterval

// // current time
// // target time
// // distance away

// const unixTimeZero = Date.parse("01 Jan 1970 00:00:00 GMT");
// const javaScriptRelease = Date.parse("04 Dec 1995 00:12:00 GMT");

// // new Date(year, monthIndex, day, hours, minutes, seconds, milliseconds);

// console.log("1: ", unixTimeZero);
// // expected output: 0

// console.log("2: ", javaScriptRelease);
// expected output: 818035920000
console.log("---------------------------------");
const momentCode = (dayINeed) => {
  //   const dayINeed = 4; // for Thursday
  const today = moment().isoWeekday();

  // if we haven't yet passed the day of the week that I need:
  if (today <= dayINeed) {
    // then just give me this week's instance of that day
    return moment().isoWeekday(dayINeed);
  } else {
    // otherwise, give me *next week's* instance of that same day
    return moment().add(1, "weeks").isoWeekday(dayINeed);
  }
};

let res = momentCode(4);

console.log("4: ", res);
let res2 = res.add(1, "hours");
console.log("42: ", res2);
let res3 = res.set({ hour: 15, minute: 32 });
console.log("4233: ", res3);
const today = moment();
console.log("423344: ", today);
const diff = res3 - today;
console.log("555: ", diff);

const timeDiff = diff / 1000 / 60 / 60 / 24;
console.log("timeDiff: ", timeDiff);

// target day and time - current day and time = result <- in milliseconds
// take result and use this in setTimeout
// then setInterval for 7 days (in milliseconds) afterwards
// clearInterval if monitoring is set to off
