const intervalSchedule = "daily";
function testIntervalSchedule(intervalSchedule) {
    switch (intervalSchedule) {
        case "weekly":
            console.log("It's weekly!");
            break;
        case "daily":
            console.log("its daily!");
            break;
        default:
            console.log("eh");
    }
}
testIntervalSchedule(intervalSchedule);
//# sourceMappingURL=w5.js.map