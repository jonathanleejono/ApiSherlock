"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiStatusOptions = exports.ApiSortOptions = exports.ApiMonitoringOptions = exports.ApiHostOptions = void 0;
var ApiHostOptions;
(function (ApiHostOptions) {
    ApiHostOptions["AWS"] = "AWS";
    ApiHostOptions["GCP"] = "GCP";
    ApiHostOptions["Azure"] = "Azure";
    ApiHostOptions["Heroku"] = "Heroku";
    ApiHostOptions["DigitalOcean"] = "DigitalOcean";
    ApiHostOptions["Other"] = "Other";
})(ApiHostOptions = exports.ApiHostOptions || (exports.ApiHostOptions = {}));
var ApiMonitoringOptions;
(function (ApiMonitoringOptions) {
    ApiMonitoringOptions["ON"] = "on";
    ApiMonitoringOptions["OFF"] = "off";
})(ApiMonitoringOptions = exports.ApiMonitoringOptions || (exports.ApiMonitoringOptions = {}));
var ApiSortOptions;
(function (ApiSortOptions) {
    ApiSortOptions["Latest"] = "Latest";
    ApiSortOptions["Oldest"] = "Oldest";
    ApiSortOptions["A_Z"] = "A-Z";
    ApiSortOptions["Z_A"] = "Z-A";
})(ApiSortOptions = exports.ApiSortOptions || (exports.ApiSortOptions = {}));
var ApiStatusOptions;
(function (ApiStatusOptions) {
    ApiStatusOptions["Healthy"] = "healthy";
    ApiStatusOptions["Unhealthy"] = "unhealthy";
    ApiStatusOptions["Pending"] = "pending";
})(ApiStatusOptions = exports.ApiStatusOptions || (exports.ApiStatusOptions = {}));
//# sourceMappingURL=apis.js.map