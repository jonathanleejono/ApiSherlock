const currentServerDateTime = new Date();
console.log(currentServerDateTime);
console.log(currentServerDateTime.getUTCDay());
console.log(new Date().getUTCMinutes());
console.log(new Date().getUTCHours());
let chicago_datetime_str = new Date().toLocaleString("en-US", {
    timeZone: "America/Chicago",
});
console.log(chicago_datetime_str);
//# sourceMappingURL=uw.js.map